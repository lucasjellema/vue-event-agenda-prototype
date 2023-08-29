<template>
  <div>

    <DataTable :value="eligibleEvents" tableStyle="min-width: 50rem" v-model:expandedRows="expandedRows"
      @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" dataKey="id" class="p-datatable-lg" sortField="eventDate"
      :sortOrder="-1" v-model:filters="filters"
      :globalFilterFields="['titel', 'bedrijf', 'omschrijving', 'tags', 'sprekers']" filterDisplay="row">
      <!-- temporarily removed from DataTable
      row selection     
      v-model:selection="selectedEvent" selectionMode="single" @rowSelect="onRowSelect"
    -->


      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">Conclusion Knowledge Events</span>
          <div>{{ $t('eventList.futureEventsToggle') }}</div>
          <InputSwitch v-model="futureEventsOnlyChecked" />
          <InputText v-model="filters['global'].value" :placeholder="$t('eventList.keywordSearch')" />
          <!-- <button @click="goAddAndEdit">Add Event</button>
          <button @click="downloadJSONFile()">Download JSON</button> -->
        </div>
      </template>
      <Column :expander="true" headerStyle="width: 3rem" />

      <Column field="titel" :header="$t('eventList.title')" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" />
        </template>
      </Column>
      <Column field="eventDate" :header="$t('eventList.date')" sortable>
        <template #body="slotProps">
          <i>{{ formatDate(slotProps.data.eventDate) }}</i>
        </template>

      </Column>
      <Column field="locatie" :header="$t('eventList.location')" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <p v-html="slotProps.data.locatie"></p>
        </template>
      </Column>
      <Column field="scope" :header="$t('eventList.access')" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" />
        </template>
      </Column>
      <Column field="bedrijf" :header="$t('eventList.company')" sortable>
        <template #body="slotProps">
          <img v-if="slotProps.data.logo != ''" :src="getLogoUrl(slotProps.data.logo)" height="30" />
          <p v-else>{{ slotProps.data.bedrijf }}</p>
        </template>

      </Column>
      <Column :header="$t('eventList.tags')">
        <template #body="slotProps">
          <!--       <template v-for="tag in slotProps.data.tagList">
          <Tag :value="tag"></Tag>
        </template>
    -->
          <p>{{ slotProps.data.tags }}</p>

        </template>
      </Column>
      <Column :header="$t('eventList.details')">
        <template #body="slotProps">
          <Button label="Details" icon="pi" severity="success" class="mr-2" @click="openDetails(slotProps.data)" />
        </template>
      </Column>

      <template #expansion="slotProps">
        <div class="p-3">
          <h5 v-html="slotProps.data.omschrijving"></h5>

        </div>
      </template>
    </DataTable>
    <Button :label="$t('eventList.expandAll')" icon="pi pi-check" @click="expandAll" />
    <Button :label="$t('eventList.collapseAll')" icon="pi pi-check" @click="collapseAll" />
    <Dialog v-model:visible="detailsModalVisible" maximizable modal v-model:header="selectedEvent.titel"
      :style="{ width: '50vw' }">
      <EventDetails :event="selectedEvent"></EventDetails>
    </Dialog>


  </div>
</template>

<script setup>

import { useEventsStore } from '../stores/datastore';
//import EventSummary from "./EventSummary.vue";
import EventDetails from "./EventDetails.vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { FilterMatchMode, FilterOperator } from "primevue/api";

import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router';

const router = useRouter();



const today = new Date()
const detailsModalVisible = ref(false)
const selectedEvent = ref({})
const expandedRows = ref([])
const filters = ref({
  titel: { value: null, matchMode: FilterMatchMode.CONTAINS },
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  locatie: { value: null, matchMode: FilterMatchMode.CONTAINS },
  scope: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const futureEventsOnlyChecked = ref(false)

const eligibleEvents = computed(() => {
  return eventData.value.filter((event) => futureEventsOnlyChecked.value ? event.eventDate > today : true)
})


function onRowExpand() { }

function onRowCollapse() { }

function expandAll() {
  expandedRows.value = eventData.value.filter(event => event.datum)
}

function collapseAll() {
  expandedRows.value = [];
}

function onRowSelect(e) {
  console.log(`select event ${selectedEvent}`)
}

function openDetails(event) {
  this.selectedEvent = { ...event };
  this.detailsModalVisible = true
}

function formatDate(theDate) {
  if (typeof theDate === "undefined") return ''
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return theDate!=''?theDate.toLocaleDateString("nl-NL", options):'';
}

function getLogoUrl(company) {
  return new URL(`../assets/company-icons/${company}.jpg`, import.meta.url).href
}

const store = useEventsStore();
store.parseCSVData()
store.sortEvents('datum', 'desc');
const { eventData } = storeToRefs(useEventsStore())

function goAddAndEdit() {
  store.addEVent()
  router.push({ name: 'editEvent' });
}

function downloadJSONFile() {
  const jsonContent = JSON.stringify(eventData.value, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ConclusionEventsAgenda.json'; // Set the desired file name
  a.click();

  // Clean up the URL object after the download
  URL.revokeObjectURL(url);
}
</script>
