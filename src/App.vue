<script setup lang="ts">
import ConclusionLogo from './components/ConclusionLogo.vue' 

</script>

<template>
  <div id="body">
    <header>
      <ConclusionLogo />
      <nav>
        <RouterLink to="/List">Lijst</RouterLink>
        <RouterLink to="/calendar">Calendar</RouterLink>
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
  margin:20px;
}
</style>