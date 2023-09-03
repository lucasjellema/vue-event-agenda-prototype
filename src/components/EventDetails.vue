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
        <template v-for="tag in getTagList(event.tags)">
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
      </p> <span v-html="event.voorbereiding"></span>
    </div>
    <div class="field" v-if="event.materialen != '' && event.materialen.length > 0">
      <p><b>{{ $t('eventDetails.resources') }}:</b> <span v-html="event.materialen"></span></p>
    </div>
    <Dialog v-if="event.locationCode" v-model:visible="locationModalVisible" maximizable modal
      :header="location.naam" :style="{ width: '80vw' }">
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
import { ref , computed} from 'vue'
import { useRouter } from 'vue-router';
import { useEventsStore } from '../stores/datastore';
import { getLogoUrl, formatDate, getLocationHTMLUrl , getTagList} from '../composables/AppLib'

const router = useRouter();
const store = useEventsStore();
import { storeToRefs } from 'pinia'
const locationModalVisible = ref(false)

const props = defineProps(['event'])

const { editEnabled } = storeToRefs(useEventsStore())

const location = computed(() => {
  const loc = store.getLocationRecord( props.event.locationCode)
  console.log(`loc = ${JSON.stringify(loc)}`)
  return loc
})

function goEdit() {
  const event = props.event
  store.setupEventForEditing(event.id)
  router.push({ name: 'editEvent' });
}

function handleDoubleClick(event) {
  store.toggleEditMode()
}

</script>


