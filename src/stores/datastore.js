import { defineStore } from 'pinia';
//import Papa from 'papaparse';

// load CSV data from the file in the assets directory; turn the data into a JSON object array; the names of the object properties are derived from the column headers (first row in CSV file) 
import eventRecords from '@/assets/knowledge-events.csv';
import locationRecords from '@/assets/locations.csv';

// the contents of the CSV file can also be loaded as a string that could then be parsed using papaparse - in case the action performed by the direct import is not adequate
// import csvString from '@/assets/data.csv?raw'

// alternatively, CSV data can be defined as string const in a Java Script module
// this allows for more finegrained parsing in case of special delimiters or charactersets 
//import { CSV, CSV_DATA } from './staticData.js';


const replaceUrlsWithLinks = (text) => {
  // Regular expression to match URLs starting with http:// or https://
  const urlRegex = /(https?:\/\/\S+)/gi;

  // Replace URLs with anchor tags
  const replacedText = text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank">link</a>`;
  });

  return replacedText;
}

const replaceNewlinesWithBrTags = (text) => {
  // Regular expression to match newline characters (both Unix and Windows style)
  const newlineRegex = /(\r\n|\r|\n)/g;

  // Replace newlines with <br /> tags
  const replacedText = text.replace(newlineRegex, "<br />");

  return replacedText;
}


export const useCounterStore = defineStore('data', {
  state: () => ({
    count: 0,
    eventData: [],
    locationData : [],
    initialized: false,
  }),
  actions: {
    async parseCSVData() {
      if (!this.initialized) {
        this.locationData = locationRecords

        // post process eventRecords
        let i = 0
        for (const rec of eventRecords) {
          rec.id = i++
          rec.tags = rec.tags.toLowerCase()
          rec.tagList = rec.tags.split(",")
          // rec.datum has format: dd-mm-yy
          let dateParts = rec.datum.split("-")
          try {
            rec.eventDate = new Date("20" + dateParts[2], dateParts[1] - 1, dateParts[0]);
          } catch (e) {
            rec.eventDate = null
          }
          rec.omschrijving = replaceNewlinesWithBrTags(replaceUrlsWithLinks(rec.omschrijving))

          // if rec.registratie contains a link (https:// or http://) then replace the link with its HTML counterpart: <a href="link" target="_new">link<</a>
          rec.registratie = replaceUrlsWithLinks(rec.registratie)
          // if rec.materialen contains a link (https:// or http://) then replace the link with its HTML counterpart: <a href="link" target="_new">link<</a>
          rec.materialen = replaceNewlinesWithBrTags(replaceUrlsWithLinks(rec.materialen))
          // if rec.locatie contains a link (https:// or http://) then replace the link with its HTML counterpart: <a href="link" target="_new">link<</a>
          rec.locatie = replaceNewlinesWithBrTags(replaceUrlsWithLinks(rec.locatie))
          // if the name of a known location appears in locatie then assign that location
          rec.location = this.locationData.filter( (value) =>  rec.locatie.toLowerCase().indexOf(  value.naam.toLowerCase() )>-1)
        }
        this.eventData = eventRecords
        this.initialized = true
      }
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
          return a[sortKey] < b[sortKey] ? 1 : -1;
        } else {
          return b[sortKey] > a[sortKey] ? -1 : 1;
        }
      });
    }
  },
});
