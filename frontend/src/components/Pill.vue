<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string
  selected?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', value: string): void
}>()
</script>

<template>
  <div
    :class="[
      props.selected ? 'text-green-900 border-green-100 bg-green-100' : 'bg-green-900 border-green-200 text-green-100',
      'rounded-xl  border px-2 py-1 inline-block transition-colors duration-200 cursor-pointer',
    ]"
    @click="emit('click', props.value)"
  >
    {{ props.label }}
  </div>
</template>
