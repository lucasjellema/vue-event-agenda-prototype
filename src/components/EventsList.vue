<template>
  <div>
    <h1>Conclusion Knowledge Events</h1>
    <DataTable :value="events" tableStyle="min-width: 50rem" v-model:expandedRows="expandedRows" 
    @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" dataKey="datum"
    >
    <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
            <span class="text-xl text-900 font-bold">Conclusion Knowledge Events</span>
            <Button icon="pi " rounded raised />
        </div>
    </template>
    <Column :expander="true" headerStyle="width: 3rem" />
      
    <Column field="titel" header="Titel" sortable >
    </Column>
    <Column field="eventDate" header="Datum" sortable>
            <template #body="slotProps">
            <i>{{ slotProps.data.eventDate }}</i>
        </template>
        </Column>
    <Column field="locatie" header="Locatie" sortable></Column>
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

import { storeToRefs } from 'pinia'



export default {  
  name : "EventsList",
  components: { EventSummary},
   data() {
    return {

      expandedRows: [],
    };
  },
   methods: {
    onRowExpand() {
      console.log("expanded");
      console.log(this.expandedRows)
    },
    onRowCollapse() {
      console.log("collapsed");
      console.log(this.expandedRows)
    },
    expandAll() {
      console.log("expand all");
      this.expandedRows = this.events.filter(event=> event.datum);
      console.log(this.expandedRows)
        },
    collapseAll() {
      console.log("collapse all");
      this.expandedRows = [];
      console.log(this.expandedRows)
        },
   },
   

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
