<template>
  <div>
    <div class="field">
      <p>
        <img v-if="event.logo != ''" :src="getLogoUrl(event.logo)" height="100" />
      </p>
    </div>
    <div class="field"><i>{{ $t('eventDetails.speakers') }}: {{ event.sprekers }}</i></div>
    <div class="field"><i>{{ $t('eventDetails.dateTime') }}: {{ event.starttijd }} - {{ event.eindtijd }} uur</i></div>
    <div class="field">
      <p><span v-html="event.omschrijving"></span></p>
    </div>
    <div class="field">
      <p>
        <template v-for="tag in event.tagList">
          <Tag :value="tag" rounded></Tag>
        </template>
      </p>
    </div>
    <div class="field" v-if="event.doelgroep != '' && event.doelgroep.length > 0">{{ $t('eventDetails.targetAudience') }}:
      {{
        event.doelgroep }}</div>
    <hr />
    <h3>{{ $t('eventDetails.logistics') }} </h3>

    <div class="field">
      <p>
        {{ $t('eventDetails.accessibleTo') }}: {{ event.scope }}
        <ConclusionIcon v-if="event.scope.indexOf('ecosysteem') > -1" />
        <IconGlobe v-else />

      </p>
    </div>
    <div class="field" v-if="event.locatie != '' && event.locatie.length > 0">
      <p><b>{{ $t('eventDetails.location') }}:</b> {{ event.locatie }}</p>
    </div>
    <div class="field">
      <p><b>{{ $t('eventDetails.hybrid') }}:</b> {{ event.hybride }}</p>
    </div>
    <div class="field">
      <p><b>{{ $t('eventDetails.registration') }}:</b> <span v-html="event.registratie"></span></p>
    </div>
    <div class="field">{{ $t('eventDetails.contact') }}: {{ event.contactpersoon }}</div>
    <div class="field" v-if="event.voorbereiding != '' && event.voorbereiding.length > 0">
      {{ $t('eventDetails.preparation') }}: {{ event.voorbereiding }}</div>
    <div class="field" v-if="event.materialen != '' && event.materialen.length > 0">
      <p><b>{{ $t('eventDetails.resources') }}:</b> <span v-html="event.materialen"></span></p>
    </div>

  </div>
</template>

<script>
import ConclusionIcon from "./ConclusionIcon.vue";
import IconGlobe from "./icons/Globe.vue";


export default {
  name: "EventDetails",
  props: ['event'],
  components: { ConclusionIcon, IconGlobe },
  methods: {
    getLogoUrl(company) {
      return new URL(`../assets/company-icons/${company}.jpg`, import.meta.url).href
    }
  }

};
</script>


