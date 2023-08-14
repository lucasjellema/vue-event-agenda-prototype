<script setup lang="ts">
import ConclusionLogo from './components/ConclusionLogo.vue'

</script>

<template>
  <div id="body">
    <header>
      <ConclusionLogo />
      <nav>
        <RouterLink to="/calendar">{{$t('router.eventCalendar')}}</RouterLink>
        |
        <RouterLink to="/List">{{$t('router.eventList')}}</RouterLink>
        <select v-model="$i18n.locale">
          <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
        </select>
      </nav>
    </header>
    <RouterView />
    <ConclusionLogo />
  </div>
</template>

<style>
nav li:hover,
.router-link-exact-active {
  font-weight: 700;
  margin: 20px;
}
nav select {
  margin: 50px;
}
</style>