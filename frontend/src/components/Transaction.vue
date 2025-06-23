<script setup lang="ts">
import { Store } from 'lucide-vue-next'
</script>

<template>
  <div class="flex gap-3">
    <div class="relative w-12 h-12 bg-blue-500 rounded-base">
      <div class="text-white absolute inset-0 flex items-center justify-center">
        <Store class="" />
      </div>
    </div>
    <div>
      <b class="text-black font-inter text-base">Walmart</b>
      <div class="text-black/50 font-bold text-sm">20 May 2025</div>
    </div>
    <div class="text-green-500 font-bold font-inter my-auto text-right flex-1">+389.00$</div>
  </div>
</template>
