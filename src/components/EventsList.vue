<template>
  <div>
    <h1>Conclusion Knowledge Events</h1>
    <DataTable :value="events" tableStyle="min-width: 50rem" v-model:expandedRows="expandedRows" 
    @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" dataKey="datum"
    sortField="eventDate" :sortOrder="-1" 
     v-model:filters="filters"  :globalFilterFields="['titel', 'omschrijving', 'sprekers']"
     filterDisplay="row"
    >
    <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
            <span class="text-xl text-900 font-bold">Conclusion Knowledge Events</span>
            <Button icon="pi " rounded raised />
            <div>Only future events?</div>
            <InputSwitch v-model="futureEventsOnlyChecked" @change="toggleIncludeFutureEventsOnly" />
             <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
    </template>
    <Column :expander="true" headerStyle="width: 3rem" />
      
    <Column field="titel" header="Titel" sortable >
      <template #filter="{ filterModel, filterCallback }">
         <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" />
      </template>
    </Column>
    <Column field="eventDate" header="Datum" sortable>
            <template #body="slotProps">
            <i>{{ slotProps.data.eventDate }}</i>
        </template>

        </Column>
    <Column field="locatie" header="Locatie" sortable>
      <template #filter="{ filterModel, filterCallback }">
         <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" />
      </template>
    </Column>
    <Column field="bedrijf" header="Bedrijf" sortable></Column>
     <template #expansion="slotProps">
        <div class="p-3">
            <h5>{{ slotProps.data.omschrijving }}</h5>
            
        </div>
    </template>
</DataTable>
  <Button label="Expand All" icon="pi pi-check" @click="expandAll" />
  <Button label="Collapse All" icon="pi pi-check" @click="collapseAll" />
    <!--
    <p  v-for="(event,index) in events" :key="index">
      <EventSummary :event="event" />
    </p>
    -->
  </div>
</template>

<script>
import { useCounterStore } from '../stores/datastore';
import EventSummary from "./EventSummary.vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { FilterMatchMode, FilterOperator } from "primevue/api";

import { storeToRefs } from 'pinia'



export default {  
  name : "EventsList",
  components: { EventSummary},
   data() {
    return {

      expandedRows: [],
      filters: {
        titel: { value: null, matchMode: FilterMatchMode.CONTAINS },
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        locatie: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      futureEventsOnlyChecked: true,
    };
  },
   methods: {
    onRowExpand() {
    },
    onRowCollapse() {
    },
    expandAll() {
      this.expandedRows = this.events.filter(event=> event.datum);
        },
    collapseAll() {
      this.expandedRows = [];
    },
     toggleIncludeFutureEventsOnly(e) {
      console.log("toggle")
      
      console.log(this.futureEventsOnlyChecked)
     // const today = new Date() 
     // this.events = this.allEvents.filter(event=> this.futureEventsOnlyChecked? event.eventDate<today : true );
     }   
   },
   

  setup() {
    const store = useCounterStore();
    store.parseCSVData()
    store.sortEvents('datum', 'desc');
    const { eventData } = storeToRefs(useCounterStore())

    return {
      allEvents: eventData,
      events: eventData
    };
  },
};
</script>
