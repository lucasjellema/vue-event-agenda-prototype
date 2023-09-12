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
      <Panel header toggleable :collapsed="true">
        <Dropdown v-model="event.logo" editable :options="logos" optionValue="code" optionLabel="name" filter
          placeholder="Select a Company logo or enter an image URL" class="w-full md:w-14rem" />
        <small id="logo-help">{{ $t('eventDetails.logo-help') }}</small>

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

    <div class="flex flex-column gap-2">
      <p><span v-html="event.omschrijving"></span></p>
      <Panel :header="$t('eventDetails.omschrijving')" toggleable :collapsed="true">
        <QuillEditor theme="snow" contentType="html" v-model:content="event.omschrijving" toolbar="full" />
      </Panel>
    </div>


    <Panel header toggleable :collapsed="true">
      <InputText id="tags" type="text" v-model="event.tags" class="wider-input" aria-describedby="tags-help" />
      <small id="tags-help">{{ $t('eventDetails.tags-help') }}</small>
      <template #header>
        Tags:
        <template v-for="tag in getTagList(event.tags)">
          <Tag :value="tag" rounded></Tag>
        </template>
      </template>
    </Panel>

    <div class="flex flex-column gap-2">
      <Panel :header="$t('eventDetails.doelgroep') + ' : ' + event.doelgroep" toggleable :collapsed="true">
        <InputText id="doelgroep" type="text" v-model="event.doelgroep" class="wider-input"
          aria-describedby="doelgroep-help" />
        <small id="doelgroep-help">{{ $t('eventDetails.doelgroep-help') }}</small>
      </Panel>
    </div>

    <hr />
    <h3>{{ $t('eventDetails.logistics') }} </h3>

    {{ $t('eventDetails.accessibleTo') }}:
    <ConclusionIcon v-if="event.scope.indexOf('ecosysteem') > -1" />
    <IconGlobe v-else />
    <div class="card flex justify-content-center">
      <div class="p-inputgroup md:w-12rem">
        <span class="p-float-label">
          Conclusion Ecosysteem
        </span>
        <span>
          <InputSwitch v-model="eventScope" @change="handleScopeChange" />
        </span>
        <span class="p-float-label">
          Public </span>
      </div>

    </div>

    <div class="p-inputgroup md:w-12rem">
      <span class="p-float-label">
        Niet fysiek bij te wonen
      </span>
      <span>
        <InputSwitch v-model="event.isFysiek" />
      </span>
      <span class="p-float-label">
        Fysiek </span>
    </div>
    <div class="field" v-if="event.isFysiek">
      <h3>{{ $t('eventDetails.location') }}:</h3><span v-html="event.locatie"></span>

      <span v-if="event.locationCode">{{ location.naam }}</span>
      <Button v-if="event.locationCode" label="Show Location Details" icon="pi pi-external-link"
        @click="locationModalVisible = true" />
      <Panel :header="$t('eventDetails.location') + ': ' + (event.locationCode ? location.naam : '')" toggleable
        :collapsed="true">
        <!-- todo add selection of location from list of predefined-->
        <Dropdown v-model="event.locationCode" :options="locations()" optionValue="code" optionLabel="name" filter
          showClear placeholder="Select a Location" class="w-full md:w-14rem" />
        <QuillEditor theme="snow" contentType="html" v-model:content="event.locatie" toolbar="full" />
      </Panel>
    </div>

    <div class="p-inputgroup md:w-12rem">
      <span class="p-float-label">
        Niet online bij te wonen
      </span>
      <span>
        <InputSwitch v-model="event.isOnline" />
      </span>
      <span class="p-float-label">
        Online aangeboden </span>
    </div>
    <div v-if="event.isOnline" class="flex flex-column gap-2">
      <Panel :header="$t('eventDetails.digitaleLink')" toggleable :collapsed="true">
        <p v-if="event.isOnline && event.digitaleLink">{{ $t('eventDetails.digitaleLink') }}<span
            v-html="event.digitaleLink"></span></p>
        <QuillEditor theme="snow" contentType="html" v-model:content="event.digitaleLink" toolbar="snow" />
      </Panel>
    </div>

    <div class="flex flex-column gap-2">
      <Panel :header="$t('eventDetails.registration')" toggleable :collapsed="true">
        <p v-if="event.registratie">{{ $t('eventDetails.registration') }}<span v-html="event.registratie"></span></p>
        <QuillEditor theme="snow" contentType="html" v-model:content="event.registratie" toolbar="full" />
      </Panel>
    </div>

    <div class="flex flex-column gap-2">
      <Panel :header="$t('eventDetails.contact') + ' : ' + event.contactpersoon" toggleable :collapsed="true">
        <InputText id="doelgroep" type="text" v-model="event.contactpersoon" class="wider-input"
          aria-describedby="contact-help" />
        <small id="contact-help">{{ $t('eventDetails.contact-help') }}</small>
      </Panel>
    </div>

    <div class="flex flex-column gap-2">
      <p v-if="event.voorbereiding">{{ $t('eventDetails.preparation') }}<span v-html="event.voorbereiding"></span></p>
      <Panel :header="$t('eventDetails.preparation')" toggleable :collapsed="true">
        <QuillEditor theme="snow" contentType="html" v-model:content="event.voorbereiding" toolbar="full" />
      </Panel>
    </div>


    <div class="flex flex-column gap-2">
      <p v-if="event.materialen">{{ $t('eventDetails.resources') }}<span v-html="event.materialen"></span></p>
      <Panel :header="$t('eventDetails.resources')" toggleable :collapsed="true">
        <QuillEditor theme="snow" contentType="html" v-model:content="event.materialen" toolbar="full" />
      </Panel>
    </div>


    <Dialog v-if="event.locationCode" v-model:visible="locationModalVisible" maximizable modal :header="location.naam"
      :style="{ width: '80vw' }">
      <p>Adres: {{ location.adres }}</p>
      <div v-if="location.mapslink">
        <a :href="location.mapslink" target="_new">Location on Google Maps</a>
      </div>
      <div v-if="location.ovlink">
        <a :href="location.ovlink" target="_new">Route by Public Transport</a>
      </div>
      <div v-if="location.resource">
        <iframe id="f1" ref="frame1" style="border: 0; width:100%; height: 500px; overflow: auto;"
          :src="getLocationHTMLUrl(location.resource)"></iframe>
      </div>
    </Dialog>
  </div>
</template>
  
<script setup>
import ConclusionIcon from "./ConclusionIcon.vue";
import IconGlobe from "./icons/Globe.vue";
import InputText from 'primevue/inputtext';
import { ref, computed } from 'vue'
import { defineProps } from 'vue';
import { useEventsStore } from '../stores/datastore';
import Button from 'primevue/button';
import { getLogoUrl, formatDate, getLocationHTMLUrl, getTagList } from '../composables/AppLib'

const store = useEventsStore();

const event = store.eventBeingEdited

const locationModalVisible = ref(false)

const eventScope = computed(() => {
  return (event.scope == 'public')
})

const location = computed(() => {
  const loc = store.getLocationRecord(event.locationCode)
  return loc
})

function locations() {
  const locations = []
  for (const loc of store.locationData) {
    locations.push({ name: loc.naam, code: loc.code })
  }
  return locations
}

function handleScopeChange() {
  // Toggle the boolean value
  event.scope = (event.scope == 'public' ? "ecosysteem" : "public")
};

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
  { name: 'Yellowtail', code: 'yellowtail' },
  { name: 'Hot ITem', code: 'hotitem' }
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
  
  
  
  
  