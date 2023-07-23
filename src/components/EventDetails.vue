<template>
   
    <div>
     <div class="field">{{event.titel}}</div>      
     <div class="field"><i>Sprekers: {{event.sprekers}}</i></div>      
     <div class="field"><i>Datum/Tijd: {{event.starttijd}}  {{event.eindtijd}}</i></div>      
     <div class="field"><p>{{event.omschrijving}}</p></div>
     <div class="field"><p>
        <template v-for="tag in event.tagList">
          <Tag :value="tag" rounded></Tag>
        </template>
       </p></div>
     <div class="field">doelgroep: {{event.doelgroep}}</div>
     <hr />
      <h3>Logistiek </h3>
     <div class="field">toegankelijk voor: {{event.scope}}</div>
     <div class="field"><p><b>locatie:</b> {{event.locatie}}</p></div>
     <div class="field"><p><b>hybride:</b> {{event.hybride}}</p></div>
     <div class="field"><p><b>registratie:</b> <span v-html="event.registratie"></span></p></div>
     <div class="field">contactpersoon: {{event.contactpersoon}}</div>
     <div class="field">voorbereiding/meenemen: {{event.voorbereiding}}</div>

      </div>
</template>

<script>
export default {
      name: "EventDetails",
      props: ['event']
};
</script>
