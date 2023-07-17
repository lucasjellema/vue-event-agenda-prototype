import { defineStore } from 'pinia';
import Papa from 'papaparse';

// load CSV data from the file data.csv in the assets directory; turn the data into a JSON object array; the names of the object properties are derived from the column headers (first row in CSV file) 
import csvRecords  from '@/assets/data.csv';
console.log(csvRecords) 

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
    loading: false,
  }),
  actions: {
    async parseCSVData() {
      this.loading = true;
      this.csvData = csvRecords
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
  },
});
