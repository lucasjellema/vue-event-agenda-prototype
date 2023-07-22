import { defineStore } from 'pinia';
//import Papa from 'papaparse';

// load CSV data from the file in the assets directory; turn the data into a JSON object array; the names of the object properties are derived from the column headers (first row in CSV file) 
import eventRecords  from '@/assets/knowledge-events.csv';

// the contents of the CSV file can also be loaded as a string that could then be parsed using papaparse - in case the action performed by the direct import is not adequate
// import csvString from '@/assets/data.csv?raw'

// alternatively, CSV data can be defined as string const in a Java Script module
// this allows for more finegrained parsing in case of special delimiters or charactersets 
//import { CSV, CSV_DATA } from './staticData.js';


export const useCounterStore = defineStore('data', {
  state: () => ({
    count: 0,
    eventData: [],
    loading: false,
  }),
  actions: {
    async parseCSVData() {
      this.loading = true;
      // post process eventRecords
      let i = 0
      for(const rec of eventRecords) {
        rec.id = i++
        rec.tagList = rec.tags.split(",")
        // rec.datum has format: dd-mm-yy
        let dateParts = rec.datum.split("-")
        try {
        rec.eventDate = new Date("20"+dateParts[2], dateParts[1]-1, dateParts[0]);
        } catch(e) {
          rec.eventDate = null
        }
      }
      this.eventData = eventRecords
      try {
        // Papa.parse(CSV_DATA, {
        //   complete: (results) => {
        //     this.csvData = results.data;
        //     this.loading = false;
        //   },
        //   header: true, // Set to true if your CSV file has headers
        // });
      } finally {
        this.loading = false;
      }
    },
    sortEvents(sortKey, sortOrder) {
      this.eventData.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortKey] < b[sortKey]?1:-1;
        } else {
          return b[sortKey] > a[sortKey]?-1:1;
        }
      });      
    }
  },
});
