<script setup lang="ts">
import { defineProps, ref } from 'vue';
import Chart from 'primevue/chart';

const props = defineProps<{
  pieListe: any[]
}>();

const chartOptions = ref({
  plugins: {
    legend: {
      display: false
    }
  }
});
</script>

<template>
  <div v-if="pieListe && pieListe.length">
    <div v-for="(pie, index) in pieListe" :key="index" class="card flex flex-column align-items-center col-12">
      <h4>{{ pie.label }}</h4>
      <br>
      <div class="flex align-items-center col-10">
        <Chart type="pie" :data="pie" :options="chartOptions" />
        <div class="flex flex-column ml-8">
          <div v-for="(label, labelIndex) in pie.labels" :key="labelIndex" class="mb-2">
            <span :style="{ color: pie.datasets[0].backgroundColor[labelIndex] }">{{ label }} {{ pie.datasets[0].data[labelIndex] }}{{ pie.label === 'Beschwerden Details' ? 'x' : '%' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Keine Daten verfügbar</p>
  </div>
</template>

<style scoped>
/* Optional: Zusätzliche Stile */
</style>
