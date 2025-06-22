<script setup lang="ts">
import TransactionGraph from '@/components/TransactionGraph.vue'
import { ArrowUp } from 'lucide-vue-next'
</script>

<template>
  <div class="pt-16 text-green-200 flex flex-col items-center gap-1">
    <span class="flex gap-1 text-center">Up <ArrowUp width="16" stroke-width="2" /></span>
    <span class="text-4xl text-green-500"><b>+29,000.89$</b></span>
    <span class="flex gap-1 text-center">Since May 1st</span>
    <TransactionGraph />
  </div>
</template>
