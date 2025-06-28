<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'

defineProps<{
  link: string
}>()
</script>

<template>
  <RouterLink :to="link">
    <div class="flex items-center gap-2 h-6">
      <ChevronLeft class="w-5 h-5 relative top-[1px]" />
      <span class="text-base leading-none">Back</span>
    </div>
  </RouterLink>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
