<template>
<div>
    <h1>Calendar Overview of Knowledge Events</h1>
  <div class="about">

     <vue-cal class="vuecal--blue-theme" style="height: 850px; width:1500px"
     :time-from="7 * 60" 
    hide-weekends
    :events="calendarEvents"
    events-count-on-year-view
    events-on-month-view="short"
    today-button
    :on-event-click="onEventClick"
     >
      <template #event="{ event, view }">
        <div class="vuecal__event-title" v-html="event.title" />
        <small class="vuecal__event-time">
          <strong>Event start:</strong> <span>{{ event.start.format("H:mm") }}</span><br/>
        </small>
      </template>
    </vue-cal>
  </div>

<Dialog v-model:visible="detailsModalVisible" maximizable modal v-model:header="selectedEvent.titel" :style="{ width: '50vw' }">
    
    <div>
     <div class="field">{{selectedEvent.titel}}</div>      
     <div class="field"><i>Sprekers: {{selectedEvent.sprekers}}</i></div>      
     <div class="field"><i>Datum/Tijd: {{selectedEvent.starttijd}}  {{selectedEvent.eindtijd}}</i></div>      
     <div class="field"><p>{{selectedEvent.omschrijving}}</p></div>
     <div class="field"><p>
        <template v-for="tag in selectedEvent.tagList">
          <Tag :value="tag" rounded></Tag>
        </template>
       </p></div>
     <div class="field">doelgroep: {{selectedEvent.doelgroep}}</div>
     <hr />
      <h3>Logistiek </h3>
     <div class="field">toegankelijk voor: {{selectedEvent.scope}}</div>
     <div class="field"><p><b>locatie:</b> {{selectedEvent.locatie}}</p></div>
     <div class="field"><p><b>hybride:</b> {{selectedEvent.hybride}}</p></div>
     <div class="field"><p><b>registratie:</b> <span v-html="selectedEvent.registratie"></span></p></div>
     <div class="field">contactpersoon: {{selectedEvent.contactpersoon}}</div>
     <div class="field">voorbereiding/meenemen: {{selectedEvent.voorbereiding}}</div>

      </div>
    </Dialog>

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
  data()  { return {detailsModalVisible: false,
      selectedEvent : {},}
  },
  computed: {
    calendarEvents() {
      return this.allEvents.map( (event) => {
        let calendarEvent= {       
           background: false,
           title : event.titel,
           originalEvent : event,
           start: event.eventDate.addMinutes( getMinutesFromTimeString(event.starttijd)  ),
           end : event.eventDate.addMinutes( getMinutesFromTimeString(event.eindtijd)  )
        }; 
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
  methods: {
    onEventClick (event, e) {
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
