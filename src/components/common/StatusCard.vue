<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  count: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  percentage: {
    type: [String, Number],
    required: true
  }
});

const bgColor = computed(() => `bg-${props.color}-100`);
const textColor = computed(() => `text-${props.color}-500`);
</script>

<template>
  <div class="col-6">
    <div class="card">
      <div class="flex justify-content-between mb-3">
        <div>
          <span class="block text-500 font-medium mb-3 text-xl" v-html="label" />
          <div class="text-900 font-medium">
            {{ count }}
          </div>
        </div>
        <div
          :class="['flex align-items-center justify-content-center border-round', bgColor]"
          style="width:2.5rem;height:2.5rem"
        >
          <i :class="['pi', icon, textColor, 'text-xl']" />
        </div>
      </div>
      <span :class="textColor">{{ percentage }}%</span>
    </div>
  </div>
</template>
