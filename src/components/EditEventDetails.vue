<template>
  <div>
    <Button label="Submit" @click="submitChanges()" />
    <h2>Edit Event</h2>

    <div class="flex flex-column gap-2">
      <Panel :header="$t('eventDetails.titel') + ' : ' + event.titel" toggleable :collapsed="true">
        <InputText id="titel" type="text" v-model="event.titel" class="wider-input" aria-describedby="titel-help" />
        <small id="titel-help">{{ $t('eventDetails.titel-help') }}</small>
      </Panel>
    </div>
    <div class="flex flex-column gap-2">
      <Panel :header="$t('eventDetails.datumTijd') + ' : ' + formatTheDate(event.eventDate) + ' '
        + event.starttijd + ' - ' + event.eindtijd + ' uur'" toggleable :collapsed="true">
        <div class="p-inputgroup md:w-45rem">
          <div class="p-inputgroup md:w-15rem">
            <span class="p-inputgroup-addon">
              <i class="pi pi-calendar"></i>
            </span>
            <span class="p-float-label">
              <Calendar v-model="event.eventDate" showButtonBar dateFormat="dd-mm-yy" aria-describedby="datum-help" />
              <!-- <small id="datum-help">{{ $t('eventDetails.datum-help') }}</small> -->
            </span>
          </div>
          <div class="p-inputgroup md:w-8rem">
            <span class="p-inputgroup-addon">
              <i class="pi pi-clock"></i>
            </span>
            <span class="p-float-label">
              <InputMask id="starttijd" v-model="event.starttijd" mask="99:99" placeholder="99:99"
                aria-describedby="starttijd-help" />
              <!-- <label for="starttijd">Starttijd</label> -->
            </span>
          </div>
          <div class="p-inputgroup md:w-8rem">
            <span class="p-inputgroup-addon">
              <i class="pi pi-clock"></i>
            </span>
            <span class="p-float-label">
              <InputMask id="eindtijd" v-model="event.eindtijd" mask="99:99" placeholder="99:99"
                aria-describedby="eindtijd-help" />
              <!-- <label for="starttijd">Eindtijd</label> -->
            </span>
          </div>
        </div>
        <!-- <small id="eindtijd-help">{{ $t('eventDetails.eindtijd-help') }}</small> -->

      </Panel>
    </div>
    <div class="flex flex-column gap-2">
      <Panel toggleable :collapsed="true">
        <Dropdown v-model="event.logo" editable :options="logos" optionValue="code" optionLabel="name" filter
          placeholder="Select a Company logo" class="w-full md:w-14rem" />
        <small id="logo-help">{{ $t('eventDetails.logo-help') }}</small>
        <!-- todo show list of Conclusion companies ; allow external image to be used as logo? -->
        <template #header>
          {{ $t('eventDetails.logo') }}
          <img v-if="event.logo != ''" :src="getLogoUrl(event.logo)" height="100" />
        </template>
      </Panel>
    </div>



    <div class="flex flex-column gap-2">
      <Panel :header="$t('eventDetails.speakers') + ' : ' + event.sprekers" toggleable :collapsed="true">
        <InputText id="sprekers" type="text" v-model="event.sprekers" class="wider-input"
          aria-describedby="sprekers-help" />
        <small id="sprekers-help">{{ $t('eventDetails.sprekers-help') }}</small>
      </Panel>
    </div>

    <div class="field">
      <p><span v-html="event.omschrijving"></span></p>
      <QuillEditor theme="snow" contentType="html" v-model:content="event.omschrijving" toolbar="full" />
    </div>
    <div class="field">
      <p>
        <template v-for="tag in event.tagList">
          <Tag :value="tag" rounded></Tag>
        </template>
      </p>
    </div>
    <div class="field" v-if="event.doelgroep != '' && event.doelgroep.length > 0">{{ $t('eventDetails.targetAudience') }}:
      {{ event.doelgroep }}</div>
    <hr />
    <h3>{{ $t('eventDetails.logistics') }} </h3>

    <div class="field">
      <p>
        {{ $t('eventDetails.accessibleTo') }}: {{ event.scope }}
        <ConclusionIcon v-if="event.scope.indexOf('ecosysteem') > -1" />
        <IconGlobe v-else />

      </p>
    </div>
    <div class="field" v-if="!(typeof event.locatie === 'undefined') && event.locatie != '' && event.locatie.length > 0">
      <p>
      <h5>{{ $t('eventDetails.location') }}:</h5> {{ event.locatie }}
      <Button v-if="event.locatie != '' && event.location.length > 0" label="Show Location Details"
        icon="pi pi-external-link" @click="locationModalVisible = true" />
      </p>
    </div>
    <div class="field">
      <p><b>{{ $t('eventDetails.hybrid') }}:</b> {{ event.hybride }}</p>
    </div>
    <div class="field">
      <p>
      <h5>{{ $t('eventDetails.registration') }}:</h5> <span v-html="event.registratie"></span></p>
    </div>
    <div class="field">
      <h5>{{ $t('eventDetails.contact') }}:</h5> {{ event.contactpersoon }}
    </div>
    <div class="field" v-if="event.voorbereiding != '' && event.voorbereiding.length > 0">
      <p>
      <h5>{{ $t('eventDetails.preparation') }}:</h5>
      </p> {{ event.voorbereiding }}
    </div>
    <div class="field" v-if="event.materialen != '' && event.materialen.length > 0">
      <p><b>{{ $t('eventDetails.resources') }}:</b> <span v-html="event.materialen"></span></p>
    </div>
    <Dialog v-if="event.location.length > 0" v-model:visible="locationModalVisible" maximizable modal
      :header="event.location[0].naam" :style="{ width: '80vw' }">
      <p>Adres: {{ event.location[0].adres }}</p>
      <div v-if="event.location[0].mapslink">
        <a :href="event.location[0].mapslink" target="_new">Location on Google Maps</a>
      </div>
      <div v-if="event.location[0].ovlink">
        <a :href="event.location[0].ovlink" target="_new">Route by Public Transport</a>
      </div>
      <div v-if="event.location[0].resource">
        <iframe id="f1" ref="frame1" style="border: 0; width:100%; height: 500px; overflow: auto;"
          :src="getLocationHTMLUrl(event.location[0].resource)"></iframe>
      </div>
    </Dialog>
  </div>
</template>
  
<script setup>
import ConclusionIcon from "./ConclusionIcon.vue";
import IconGlobe from "./icons/Globe.vue";
import InputText from 'primevue/inputtext';
import { ref } from 'vue'
import { defineProps } from 'vue';
import { useEventsStore } from '../stores/datastore';
import Button from 'primevue/button';

const store = useEventsStore();

const event = store.eventBeingEdited

const locationModalVisible = ref(false)

const logos = [
  { name: 'AMIS', code: 'amis' },
  { name: 'Xforce', code: 'xforce' },
  { name: 'Conclusion', code: 'conclusion' },
  { name: '4NG', code: '4ng' },
  { name: 'Enablement', code: 'enablement' },
  { name: 'myBrand', code: 'mybrand' },
  { name: 'Mediaan', code: 'mediaan' },
  { name: 'First8', code: 'first8' },
  { name: 'KWD', code: 'kwd' },
  { name: 'Furore', code: 'furore' },
  { name: 'Low Code Company', code: 'lowcodecompany' },
  { name: 'MBS', code: 'mbs' },
  { name: 'Consulting', code: 'consulting' },
  { name: 'Morgens', code: 'morgens' },
  { name: 'Conclusion AFAS Solutions', code: 'cas' },
  { name: 'Yellowtail', code: 'yellowtail' }
];

logos.sort((a, b) => {
  const nameA = a.name.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
  const nameB = b.name.toUpperCase();

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0; // Names are equal
});

// event is current event from state store ??

function getLogoUrl(company) {
  if (!(typeof company === "undefined") && (company != '') && (company.indexOf('http') == 0)) {
    return company
  }
  return new URL(`../assets/company-icons/${company}.jpg`, import.meta.url).href
}

function getLocationHTMLUrl(location) {
  return new URL(`../assets/locations/${location}.html`, import.meta.url).href
}

function submitChanges() {
  // call store action to update the event
  store.saveChangesInCurrentlyEditedEvent()
}

function formatTheDate(theDate) {
  if (typeof theDate === "undefined") return ''
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return theDate != '' ? theDate.toLocaleDateString("nl-NL", options) : '';
}


</script>
<style>
:root {
  --input-width: 800px;
}

.wider-input {
  width: var(--input-width);
}
</style>
  
  
  
  
  