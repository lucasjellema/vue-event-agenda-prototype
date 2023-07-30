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

          <img v-if="slotProps.data.logo != ''" :src="'src/assets/company-icons/'.concat(slotProps.data.logo, '.jpg')"
            height="30" />
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

<script>
import { useEventsStore } from '../stores/datastore';
import EventSummary from "./EventSummary.vue";
import EventDetails from "./EventDetails.vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { FilterMatchMode, FilterOperator } from "primevue/api";

import { storeToRefs } from 'pinia'


const today = new Date()

export default {
  name: "EventsList",
  components: { EventSummary, EventDetails },
  data() {
    return {
      detailsModalVisible: false,
      selectedEvent: {},
      expandedRows: [],
      filters: {
        titel: { value: null, matchMode: FilterMatchMode.CONTAINS },
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        locatie: { value: null, matchMode: FilterMatchMode.CONTAINS },
        scope: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      futureEventsOnlyChecked: false,
    };
  },
  computed: {
    // a computed getter to return the set of events that the datatable can display - given global filters
    // currently only a filter for future events/all Events
    // possibly also: a toggle for public events/ecosysteem events 
    eligibleEvents() {
      return this.allEvents.filter((event) => this.futureEventsOnlyChecked ? event.eventDate > today : true)
    }
  },
  methods: {
    onRowExpand() {
    },
    onRowCollapse() {
    },
    expandAll() {
      this.expandedRows = this.events.filter(event => event.datum);
    },
    collapseAll() {
      this.expandedRows = [];
    },
    onRowSelect(e) {
      console.log(`select event ${this.selectedEvent}`)
    },
    openDetails(event) {
      this.selectedEvent = { ...event };
      this.detailsModalVisible = true
    },
    formatDate(theDate) {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return theDate.toLocaleDateString("nl-NL", options);
    }
  },


  setup() {
    const store = useEventsStore();
    store.parseCSVData()
    store.sortEvents('datum', 'desc');
    const { eventData } = storeToRefs(useEventsStore())

    return {
      allEvents: eventData,
      events: eventData
    };
  },
};
</script>
