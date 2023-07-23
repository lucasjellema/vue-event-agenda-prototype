<script setup lang="ts">
//import RouterView from 

</script>

<template>
  <div id="body">
    <header>
      <nav>
        <RouterLink to="/">Lijst</RouterLink>
        <RouterLink to="/calendar">Calendar</RouterLink>
      </nav>
    </header>
    <RouterView />
  </div>
</template>

<style>
nav li:hover,
.router-link-exact-active {
  font-weight: 700;
  margin:20px;
}
</style>