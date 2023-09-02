<template>
  <div >
    <button @click="goEdit" v-if="editEnabled">Edit Event Details</button>
    <div class="field">
      <p>
        <img v-if="event.logo != ''" :src="getLogoUrl(event.logo)" height="100" />
      </p>
    </div>
    <div class="field" @dblclick="handleDoubleClick"><i>{{ $t('eventDetails.speakers') }}: {{ event.sprekers }}</i></div>
    <div class="field"><i>{{ $t('eventDetails.dateTime') }}: {{ formatDate(event.eventDate) }} {{ event.starttijd }} - {{
      event.eindtijd }} uur</i></div>
    <div class="field">
      <p><span v-html="event.omschrijving"></span></p>
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
      <Button v-if="event.location.length > 0" label="Show Location Details" icon="pi pi-external-link"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useEventsStore } from '../stores/datastore';
import { getLogoUrl, formatDate, getLocationHTMLUrl } from '../composables/AppLib'

const router = useRouter();
const store = useEventsStore();
import { storeToRefs } from 'pinia'
const locationModalVisible = ref(false)

const props = defineProps(['event'])

const { editEnabled } = storeToRefs(useEventsStore())


function goEdit() {
  const event = props.event
  store.setupEventForEditing(event.id)
  router.push({ name: 'editEvent' });
}

function handleDoubleClick(event) {
  store.toggleEditMode()
}

</script>


