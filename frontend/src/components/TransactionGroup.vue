<script setup lang="ts">
import Transaction from '@/components/Transaction.vue'
</script>

<template>
  <div class="flex flex-col gap-3 w-full">
    <span class="text-left w-full font-inter text-black/50 font-semibold">Today</span>
    <div class="flex flex-col gap-3">
      <Transaction />
      <Transaction />
      <Transaction />
    </div>
  </div>
</template>
