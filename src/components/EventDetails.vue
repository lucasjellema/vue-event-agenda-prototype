<template>
   
    <div>
     <div class="field">{{event.titel}}</div>      
     <div class="field"><i>Sprekers: {{event.sprekers}}</i></div>      
     <div class="field"><i>Datum/Tijd: {{event.starttijd}} - {{event.eindtijd}} uur</i></div>      
     <div class="field"><p><span v-html="event.omschrijving"></span></p></div>
     <div class="field"><p>
        <template v-for="tag in event.tagList">
          <Tag :value="tag" rounded></Tag>
        </template>
       </p></div>
     <div class="field">doelgroep: {{event.doelgroep}}</div>
     <hr />
      <h3>Logistiek </h3>
     <div class="field"><p>
       toegankelijk voor: {{event.scope}} 
       <ConclusionIcon v-if="event.scope=='ecosysteem'"/>
       <IconGlobe v-else/>

     </p>
     </div>
     <div class="field"><p><b>locatie:</b> {{event.locatie}}</p></div>
     <div class="field"><p><b>hybride:</b> {{event.hybride}}</p></div>
     <div class="field"><p><b>registratie:</b> <span v-html="event.registratie"></span></p></div>
     <div class="field">contactpersoon: {{event.contactpersoon}}</div>
     <div class="field">voorbereiding/meenemen: {{event.voorbereiding}}</div>
     <div class="field"><p><b>materialen:</b> <span v-html="event.materialen"></span></p></div>

      </div>
</template>

<script>
import ConclusionIcon from "./ConclusionIcon.vue";
import IconGlobe from  "./icons/Globe.vue";


export default {
      name: "EventDetails",
      props: ['event'],
      components: {ConclusionIcon, IconGlobe},

     };
</script>
