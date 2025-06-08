<script lang="ts">
import type { FunctionalComponent } from 'vue'

export default {
  props: {
    label: {
      type: String,
      default: 'Default Label',
    },
    type: {
      type: String,
      default: 'text',
    },
    icon: Object as () => FunctionalComponent,
  },
}
</script>

<template>
  <div class="relative">
    <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
      <slot></slot>
    </div>
    <input
      :type="type"
      class="border border-1 border-green-500 text-black rounded-base w-full pl-10"
    />
  </div>
</template>

<style scoped>
input {
  height: 48px;
}
</style>
