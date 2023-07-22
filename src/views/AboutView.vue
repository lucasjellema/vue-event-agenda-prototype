<template>
  <div class="about">
    <h1>Calendar Overview of Knowledge Events</h1>
     <vue-cal class="vuecal--blue-theme" style="height: 850px; width:1500px"
     :time-from="7 * 60" 
    hide-weekends
    :events="calendarEvents"
    events-count-on-year-view
    events-on-month-view="short"
    today-button
     >
      <template #event="{ event, view }">
        <div class="vuecal__event-title" v-html="event.title" />
        <small class="vuecal__event-time">
          <strong>Event start:</strong> <span>{{ event.start.formatTime("HH:mm") }}</span><br/>
        </small>
      </template>
    </vue-cal>
  </div>
</template>

<script>
// Documentation: https://antoniandre.github.io/vue-cal

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useCounterStore } from '../stores/datastore';
import { storeToRefs } from 'pinia'

const getMinutesFromTimeString = (timeString) => {
        let uur = 60 * parseInt(timeString.slice(0,2));
        let min = timeString.slice(3)
        let mins = min=="00"?0: parseInt(min)
  return uur+mins
}

export default {
  components: { VueCal },
  data()  { return {}
  },
  computed: {
    calendarEvents() {
      return this.allEvents.map( (event) => {
        let calendarEvent= {        class: "lunch",
        background: false

        }; 
        calendarEvent.title= event.titel;
        calendarEvent.start = event.eventDate.addMinutes( getMinutesFromTimeString(event.starttijd)  );  
        calendarEvent.end = event.eventDate.addMinutes( getMinutesFromTimeString(event.eindtijd)  );  
        return calendarEvent;})
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
