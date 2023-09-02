<template>
  Event Overview
  <div>
    <EventDetails :event="selectedEvent"></EventDetails>
  </div>
</template>

<script setup>


import { useEventsStore } from '../stores/datastore';
import { storeToRefs } from 'pinia'
import EventDetails from "../components/EventDetails.vue";
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter()
import { onMounted } from 'vue'
import { getLogoUrl, getMinutesFromTimeString, createSlugForEvent } from '../composables/AppLib'

const store = useEventsStore();
store.initializeEventsData()
const { eventData } = storeToRefs(useEventsStore())



const selectedEvent = computed(() => {
  const slug = router.currentRoute.value.path.substring(router.currentRoute.value.path.indexOf('/event/') + 7) 
  const event = eventData.value.filter((event) => slug == createSlugForEvent(event) )[0]
  return event
})


</script>