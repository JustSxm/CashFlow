<script setup lang="ts">
import { computed } from 'vue'

var model = defineModel({
  type: Boolean,
  default: false,
})

const toggle = () => {
  model.value = !model.value
}

const isEnabled = computed(() => model.value)
</script>

<template>
  <div class="relative flex items-center justify-center" @click="toggle">
    <div :class="`w-16 h-8 rounded-xl ${isEnabled ? 'bg-green-500' : 'bg-[#A8A8A8]'}`"></div>
    <div
      :class="`absolute w-6 h-6 rounded-full bg-white shadow-lg transition-transform duration-200 ${isEnabled ? 'translate-x-4' : '-translate-x-4'}`"
    ></div>
  </div>
</template>
