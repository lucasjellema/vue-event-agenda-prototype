<template>
  <div>
    <h1>Calendar Overview of Knowledge Events</h1>
    <div class="about">

      <vue-cal class="vuecal--blue-theme" style="height: 850px; width:1500px" :time-from="7 * 60" hide-weekends
        :events="calendarEvents" events-count-on-year-view events-on-month-view="short" today-button
        :on-event-click="onEventClick" active-view="month" :disable-views="['years']" locale="nl" >
        <template #event="{ event, view }">
          <div class="vuecal__event-title">
            <p v-html="event.title.concat(' (', event.start.format('H:mm'), ')')" />

            <img v-if="event.originalEvent.logo != ''"
              :src="'src/assets/company-icons/'.concat(event.originalEvent.logo, '.jpg')" height="30" />
            <ConclusionIcon v-if="event.originalEvent.scope.indexOf('ecosysteem') > -1" />
            <IconGlobe v-else />
          </div>
        </template>
      </vue-cal>
    </div>

    <Dialog v-model:visible="detailsModalVisible" maximizable modal v-model:header="selectedEvent.titel"
      :style="{ width: '50vw' }">
      <EventDetails :event="selectedEvent"></EventDetails>
    </Dialog>

  </div>
</template>

<script>
// Documentation: https://antoniandre.github.io/vue-cal

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useCounterStore } from '../stores/datastore';
import { storeToRefs } from 'pinia'
import EventDetails from "../components/EventDetails.vue";
import ConclusionIcon from "../components/ConclusionIcon.vue";
import IconGlobe from "../components/icons/Globe.vue";




const getMinutesFromTimeString = (timeString) => {
  let uur = 60 * parseInt(timeString.slice(0, 2));
  let min = timeString.slice(3)
  let mins = min == "00" ? 0 : parseInt(min)
  return uur + mins
}

export default {
  components: { VueCal, EventDetails, ConclusionIcon, IconGlobe },
  data() {
    return {
      detailsModalVisible: false,
      selectedEvent: {},
    }
  },
  computed: {
    calendarEvents() {
      return this.allEvents.map((event) => {
        let calendarEvent = {
          background: false,
          title: event.titel,
          originalEvent: event,
          start: event.eventDate.addMinutes(getMinutesFromTimeString(event.starttijd)),
          end: event.eventDate.addMinutes(getMinutesFromTimeString(event.eindtijd))
        };
        return calendarEvent;
      })
    },
  },

  setup() {
    const store = useCounterStore();
    store.parseCSVData()
    const { eventData } = storeToRefs(useCounterStore())

    return {
      allEvents: eventData
    };
  },
  methods: {
    onEventClick(event, e) {
      this.selectedEvent = event.originalEvent
      this.detailsModalVisible = true
      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation()
    },
  }
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
