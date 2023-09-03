import { defineStore } from 'pinia';
import axios from 'axios';
import Papa from 'papaparse';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

// load CSV data from the file in the assets directory; turn the data into a JSON object array; the names of the object properties are derived from the column headers (first row in CSV file) 
import eventRecords from '@/assets/knowledge-events.csv';
import locationRecords from '@/assets/locations.csv';
// load JSON data from the file in the assets directory; this turns the data into a JSON object array
import eventsJSON from '@/assets/conclusionEvents.json';

// the contents of the CSV file can also be loaded as a string that could then be parsed using papaparse - in case the action performed by the direct import is not adequate
// import csvString from '@/assets/data.csv?raw'

// alternatively, CSV data can be defined as string const in a Java Script module
// this allows for more finegrained parsing in case of special delimiters or charactersets 
//import { CSV, CSV_DATA } from './staticData.js';


const replaceUrlsWithLinks = (text) => {
  if (text) {
    // Regular expression to match URLs starting with http:// or https://
    const urlRegex = /(https?:\/\/\S+)/gi;

    // Replace URLs with anchor tags
    const replacedText = text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank">link</a>`;
    });

    return replacedText;
  } else return text
}

const replaceNewlinesWithBrTags = (text) => {
  if (text) {
    // Regular expression to match newline characters (both Unix and Windows style)
    const newlineRegex = /(\r\n|\r|\n)/g;

    // Replace newlines with <br /> tags
    const replacedText = text.replace(newlineRegex, "<br />");

    return replacedText;
  }
  else return text
}

const EVENTS_CSV_FILE = 'https://api.github.com/repos/lucasjellema/vue-event-agenda-prototype/contents/src/assets/knowledge-events.csv'
const EVENTS_JSON_FILE = 'https://api.github.com/repos/lucasjellema/vue-event-agenda-prototype/contents/src/assets/conclusionEvents.json'

const fetchData = async (githubURL) => {
  const response = await axios.get(githubURL, {
    headers: {
      Accept: 'application/vnd.github.v3.raw', // Request raw content
    },
  });
  return response
}


const fetchCSVData = async () => {
  try {

    const response = await fetchData(EVENTS_CSV_FILE)
    const parsedData = Papa.parse(response.data, { header: true });
    return parsedData
  } catch (error) {
    console.error('Error fetching CSV data:', error);
    return null
  }
}


export const useEventsStore = defineStore('data', {
  state: () => ({
    count: 0,
    eventData: [],
    locationData: [],
    initialized: false,
    eventBeingEdited: ref({}),
    editEnabled: ref(false)
  }),
  actions: {
    async initializeEventsData() {

      if (!this.initialized) {
        const eventsFromGitHubJSONResponse = await fetchData(EVENTS_JSON_FILE)
        const eventsJSON = eventsFromGitHubJSONResponse.data
        // post process eventsJSON: property eventDate should be turned from String to Date
        for (let i = 0; i < eventsJSON.length; i++) {
          eventsJSON[i].eventDate = new Date(eventsJSON[i].eventDate);
          //TODO volgende 3 regels tijdelijk, totdat de JSON file is bijgewerkt
          eventsJSON[i].isFysiek = eventsJSON[i].hybride.toLowerCase().indexOf("online") == -1
          eventsJSON[i].isOnline = eventsJSON[i].hybride.toLowerCase().indexOf("online") > -1
          eventsJSON[i].locationCode = ""
          
        }

        console.log(eventsJSON)
        const eventsFromGitHub = await fetchCSVData()
        // overwrite locally defined eventData with the events fetched from GitHub
        if (eventsFromGitHub)
          console.log(`apply events read from GitHub`)
        this.eventData = eventsFromGitHub

        this.locationData = locationRecords

        // post process eventRecords
        let i = 0
        for (const rec of eventsFromGitHub.data) {
          //rec.id = i++
          rec.id = uuidv4()
          if (rec.tags) rec.tags = rec.tags.toLowerCase()
          if (rec.tagList) rec.tagList = rec.tags.split(",")
          // rec.datum has format: dd-mm-yy
          if (rec.datum) {
            let dateParts = rec.datum.split("-")
            try {
              rec.eventDate = new Date("20" + dateParts[2], dateParts[1] - 1, dateParts[0]);
            } catch (e) {
              rec.eventDate = null
            }
          } else rec.eventDate = null
          rec.omschrijving = replaceNewlinesWithBrTags(replaceUrlsWithLinks(rec.omschrijving))

          // if rec.registratie contains a link (https:// or http://) then replace the link with its HTML counterpart: <a href="link" target="_new">link<</a>
          rec.registratie = replaceUrlsWithLinks(rec.registratie)
          // if rec.materialen contains a link (https:// or http://) then replace the link with its HTML counterpart: <a href="link" target="_new">link<</a>
          rec.materialen = replaceNewlinesWithBrTags(replaceUrlsWithLinks(rec.materialen))
          // if rec.locatie contains a link (https:// or http://) then replace the link with its HTML counterpart: <a href="link" target="_new">link<</a>
          rec.locatie = replaceNewlinesWithBrTags(replaceUrlsWithLinks(rec.locatie))
          // if the name of a known location appears in locatie then assign that location
          if (rec.locatie) {
            rec.location = this.locationData.filter((value) => rec.locatie.toLowerCase().indexOf(value.naam.toLowerCase()) > -1)
          }
        }
        // filter events that have no omschrijving - this can happen with empty rows/closing newline characters in the CSV document
        this.eventData = eventsFromGitHub.data.filter((event) => event.omschrijving).concat(eventsJSON)

        this.initialized = true
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
    },
    getLocationRecord(locationCode) {
      let location = {}
      try {
        location = this.locationData.filter((rec) => rec.code == locationCode)[0]
      } catch {
        
      }
      return location
    }
    ,
    setupEventForEditing(eventIdToEdit) {
      // find event
      const event = this.eventData.find((event) => event.id == eventIdToEdit)
      // TODO check for event not found
      // clone event and set clone as the event being edited
      this.eventBeingEdited = ref({ ...event });
    },
    saveChangesInCurrentlyEditedEvent() {
      const event = this.eventData.find((event) => event.id == this.eventBeingEdited.id)
      // update event with properties from eventBeingEdited
      Object.assign(event, this.eventBeingEdited);
      // at this point, the collection this.eventData is updated with the new event details and these are shown in Calendar and List
    },
    addEVent() {
      const newEvent = { id: uuidv4(), titel: "New Event", eventDate: new Date(), doelgroep: "", locatie: "", scope: "", voorbereiding: "", materialen: "", location: "", starttijd: "17:00", eindtijd: "18:00" }
      this.eventData.push(newEvent)
      this.setupEventForEditing(newEvent.id)
    },
    toggleEditMode() {
      this.editEnabled= !this.editEnabled
    }

  },
});
