<template>
  <div>
    
    <DataTable :value="eligibleEvents" tableStyle="min-width: 50rem" v-model:expandedRows="expandedRows" 
    @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" dataKey="id"
    class="p-datatable-lg"
    sortField="eventDate" :sortOrder="-1" 
     v-model:filters="filters"  :globalFilterFields="['titel', 'omschrijving', 'sprekers']"
     filterDisplay="row"
   >
   <!-- temporarily removed from DataTable
      row selection     
      v-model:selection="selectedEvent" selectionMode="single" @rowSelect="onRowSelect"
    -->


    <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
            <span class="text-xl text-900 font-bold">Conclusion Knowledge Events</span>
            <div>Only future events?</div>
            <InputSwitch v-model="futureEventsOnlyChecked" />
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
            <i>{{ formatDate(slotProps.data.eventDate) }}</i>
        </template>

        </Column>
    <Column field="locatie" header="Locatie" sortable>
      <template #filter="{ filterModel, filterCallback }">
         <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" />
      </template>
    </Column>
    <Column field="bedrijf" header="Bedrijf" sortable></Column>
    <Column header="Tags">
       <template #body="slotProps">
<!--       <template v-for="tag in slotProps.data.tagList">
          <Tag :value="tag"></Tag>
        </template>
    -->
         <p>{{slotProps.data.tags}}</p>
         
       </template>
    </Column>
    <Column header="Details">
       <template #body="slotProps">
         <Button label="Details" icon="pi" severity="success" class="mr-2" @click="openDetails(slotProps.data)" />
       </template>
    </Column>

     <template #expansion="slotProps">
        <div class="p-3">
            <h5>{{ slotProps.data.omschrijving }}</h5>
            
        </div>
    </template>
</DataTable>
  <Button label="Expand All" icon="pi pi-check" @click="expandAll" />
  <Button label="Collapse All" icon="pi pi-check" @click="collapseAll" />
   <Dialog v-model:visible="detailsModalVisible" maximizable modal v-model:header="selectedEvent.titel" :style="{ width: '50vw' }">
    
    <div>
     <div class="field">{{selectedEvent.titel}}</div>      
     <div class="field"><i>Sprekers: {{selectedEvent.sprekers}}</i></div>      
     <div class="field"><i>Datum/Tijd: {{formatDate(selectedEvent.eventDate)}}  {{selectedEvent.tijd}}</i></div>      
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
     <div class="field"><p><b>registratie:</b> {{selectedEvent.registratie}}</p></div>
     <div class="field">contactpersoon: {{selectedEvent.contactpersoon}}</div>
     <div class="field">voorbereiding/meenemen: {{selectedEvent.voorbereiding}}</div>

      </div>
    </Dialog>

 
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


const today = new Date() 

export default {  
  name : "EventsList",
  components: { EventSummary},
   data() {
    return {
      detailsModalVisible: false,
      selectedEvent : {},
      expandedRows: [],
      filters: {
        titel: { value: null, matchMode: FilterMatchMode.CONTAINS },
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        locatie: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      futureEventsOnlyChecked: false,
    };
  },
  computed: {
    // a computed getter to return the set of events that the datatable can display - given global filters
    // currently only a filter for future events/all Events
    // possibly also: a toggle for public events/ecosysteem events 
    eligibleEvents() {
      return this.allEvents.filter( (event) => this.futureEventsOnlyChecked? event.eventDate > today : true)
    }
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
     onRowSelect(e) {
      console.log(`select event ${this.selectedEvent}`)
     },
     openDetails(event) {
      this.selectedEvent= {...event};
      this.detailsModalVisible = true
     },
     formatDate(theDate) {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return theDate.toLocaleDateString("nl-NL", options); 
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
