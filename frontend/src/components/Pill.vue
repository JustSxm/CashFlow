<script setup lang="ts">
const props = defineProps<{
  label: string
}>()
</script>

<template>
  <div class="rounded-xl bg-green-900 text-green-100 border border-green-200 px-2 py-1 inline-block">{{ props.label }}</div>
</template>
