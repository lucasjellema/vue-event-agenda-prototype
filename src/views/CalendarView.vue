<template>
  <div>
    <h1>{{ $t('calendar.title') }}</h1>
    <div class="about">

      <vue-cal class="vuecal--blue-theme" style="height: 850px; width:1500px" :time-from="7 * 60" hide-weekends
        :events="calendarEvents" events-count-on-year-view events-on-month-view="short" today-button
        :on-event-click="onEventClick" active-view="month" :disable-views="['years']" :locale="$i18n.locale">
        <template #event="{ event, view }">
          <div class="vuecal__event-title">
            <p v-html="event.title.concat(' (', event.start.format('H:mm'), ')')" />

            <img v-if="event.originalEvent.logo != ''" class="aloof" :src="getLogoUrl(event.originalEvent.logo)"
              height="30" />
            <ConclusionIcon v-if="event.originalEvent.scope.indexOf('ecosysteem') > -1" />
            <IconGlobe v-else />
          </div>
        </template>
      </vue-cal>
    </div>

    <Dialog v-model:visible="detailsModalVisible" maximizable modal v-model:header="selectedEvent.titel"
      :style="{ width: '50vw' }" @after-hide="handleDialogHidden()">
      <EventDetails :event="selectedEvent"></EventDetails>
    </Dialog>

  </div>
</template>

<script setup>
// Documentation: https://antoniandre.github.io/vue-cal

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useEventsStore } from '../stores/datastore';
import { storeToRefs } from 'pinia'
import EventDetails from "../components/EventDetails.vue";
import ConclusionIcon from "../components/ConclusionIcon.vue";
import IconGlobe from "../components/icons/Globe.vue";
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter()

import { getLogoUrl, getMinutesFromTimeString ,createSlugForEvent} from '../composables/AppLib'



const detailsModalVisible = ref(false)
const selectedEvent = ref({})


const calendarEvents = computed(() => {
  return eventData.value.map((event) => {
    let calendarEvent = {
      background: false,
      title: event.titel,
      originalEvent: event,
      start: event.eventDate.addMinutes(getMinutesFromTimeString(event.starttijd)),
      end: event.eventDate.addMinutes(getMinutesFromTimeString(event.eindtijd))
    };
    return calendarEvent;
  })
})

const store = useEventsStore();
store.initializeEventsData()
const { eventData } = storeToRefs(useEventsStore())
const pathname = window.location.pathname;
function onEventClick(event, e) {
  selectedEvent.value = event.originalEvent
  detailsModalVisible.value = true


  // Using a route object with parameters
  // this triggers the router to actually perform the navigation
  //router.push({ path: `/event-details/${createSlugForEvent(event.originalEvent)}`, query: { event: '20230905-title-of-event' } });

  // Update the URL without triggering a route change
  // the user will see the changed URL - but Vue does not know about it
  window.history.pushState({}, '', `${pathname}/event-details/${createSlugForEvent(event.originalEvent)}`);

  // Prevent navigating to narrower view (default vue-cal behavior).
  e.stopPropagation()
}

function handleDialogHidden() {
  window.history.pushState({}, '', `${pathname}`);

}

// function getLogoUrl(company) {
//   return new URL(`../assets/company-icons/${company}.jpg`, import.meta.url).href
// }

// function getLogoUrl(company) {
//   return new URL(`../assets/company-icons/${company}.jpg`, import.meta.url).href
// }

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

.aloof {
  padding-right: 10px;
}
</style>
