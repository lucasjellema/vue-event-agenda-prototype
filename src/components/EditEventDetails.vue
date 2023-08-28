<template>
  <div>
    <Button label="Submit" @click="submitChanges()" />
    <h2>Edit Event</h2>

    <div class="flex flex-column gap-2">
      <label for="titel">{{ $t('eventDetails.titel') }}</label>
      <InputText id="titel" type="text" v-model="event.titel" class="wider-input" aria-describedby="titel-help" />
      <small id="titel-help">{{ $t('eventDetails.titel-help') }}</small>
    </div>
    <div class="field">
      <p>
        <img v-if="event.logo != ''" :src="getLogoUrl(event.logo)" height="100" />
      </p>
    </div>
    <InputText type="text" v-model="event.logo" class="wider-input" />
    <!-- todo show list of Conclusion companies ; allow external image to be used as logo? -->
    <div class="field"><i>{{ $t('eventDetails.speakers') }}: {{ event.sprekers }}</i></div>
    <div class="field"><i>{{ $t('eventDetails.dateTime') }}: {{ event.starttijd }} - {{ event.eindtijd }} uur</i></div>
    <div class="field">
      <p><span v-html="event.omschrijving"></span></p>
      <Panel :header="$t('eventDetails.editOmschrijving')" toggleable collapsed="true">
        <QuillEditor theme="snow" contentType="html" v-model:content="event.omschrijving" toolbar="full" />
</Panel>
      
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
    <div class="field" v-if="event.locatie != '' && event.locatie.length > 0">
      <p>
      <h5>{{ $t('eventDetails.location') }}:</h5> {{ event.locatie }}
      <Button v-if="event.locatie != '' && event.location.length > 0" label="Show Location Details" icon="pi pi-external-link"
        @click="locationModalVisible = true" />
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

// event is current event from state store ??

function getLogoUrl(company) {
  return new URL(`../assets/company-icons/${company}.jpg`, import.meta.url).href
}

function getLocationHTMLUrl(location) {
  return new URL(`../assets/locations/${location}.html`, import.meta.url).href
}

function submitChanges() {
  // call store action to update the event
  store.saveChangesInCurrentlyEditedEvent()
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

