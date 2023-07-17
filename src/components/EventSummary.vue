<template>
  <div>
      <p>{{ event.titel }}</p>
      <p>{{ event.datum }} tijd: {{ event.tijd }} locatie: {{event.locatie}}</p>
      <br />
      
  </div>
</template>

<script>
export default {
      name: "EventSummary",
      props: ['event']
};
</script>
