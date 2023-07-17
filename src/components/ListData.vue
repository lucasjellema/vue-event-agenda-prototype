<template>
  <div>
    <h1>{{ count }}</h1>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>

    <p v-if="loading">Loading csv records...</p>
    <p v-text="loading"></p>
    <p  v-for="record in csvRecords" :key="record.Naam">
      <p>{{ record.Naam }}</p>
    </p>
  </div>
</template>

<script>
import { useCounterStore } from '../stores/datastore';
import { storeToRefs } from 'pinia'

export default {
  setup() {
    const store = useCounterStore();
    store.parseCSVData()
    const { count, csvData, loading } = storeToRefs(useCounterStore())
    return {
      count: count,
      csvRecords: csvData,
      loading:loading,
      increment: store.increment,
      decrement: store.decrement,
    };
  },
};
</script>
