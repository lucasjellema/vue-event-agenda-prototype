<template>
  <div>
    <h1>Conclusion Knowledge Events</h1>

    <p  v-for="(event,index) in events" :key="index">
      <EventSummary :event="event" />
    </p>
  </div>
</template>

<script>
import { useCounterStore } from '../stores/datastore';
import EventSummary from "./EventSummary.vue";
import { storeToRefs } from 'pinia'

export default {  
  components: { EventSummary},

  setup() {
    const store = useCounterStore();
    store.parseCSVData()
    store.sortEvents('datum', 'desc');
    const { eventData } = storeToRefs(useCounterStore())
    return {
      events: eventData
  
      };
  },
};
</script>
