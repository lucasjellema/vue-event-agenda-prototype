import { defineStore } from 'pinia';
import Papa from 'papaparse';

// load CSV data from the file data.csv in the assets directory; turn the data into a JSON object array; the names of the object properties are derived from the column headers (first row in CSV file) 
import csvRecords  from '@/assets/data.csv';
console.log(csvRecords) 
import eventRecords  from '@/assets/knowledge-events.csv';
console.log(eventRecords) 

// the contents of the CSV file can also be loaded as a string that could then be parsed using papaparse - in case the action performed by the direct import is not adequate
import csvString from '@/assets/data.csv?raw'
console.log(csvString)

// alternatively, CSV data can be defined as const in a Java Script module
import { CSV, CSV_DATA } from './staticData.js';
console.log(`CSV ${CSV}`);


export const useCounterStore = defineStore('data', {
  state: () => ({
    count: 0,
    csvData: [],
    eventData: [],
    loading: false,
  }),
  actions: {
    async parseCSVData() {
      this.loading = true;
      this.csvData = csvRecords
      // post process eventRecords
      for(const rec of eventRecords) {
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
    increment() {
      this.parseCSVData();
      this.count++;
    },
    decrement() {
      this.count--;
    },
    sortEvents(sortKey, sortOrder) {
      this.eventData.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortKey] < b[sortKey]?1:-1;
        } else {
          return b[sortKey] > a[sortKey]?-1:1;
        }
      });
      console.log(this.eventData)
    }
  },
});
