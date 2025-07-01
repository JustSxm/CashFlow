<script setup lang="ts">
let props = defineProps<{
  placeholder?: string
  type?: string
}>()

const model = defineModel<number | string>({
  default: '',
})
</script>

<template>
  <div class="relative">
    <input
      :type="type ?? 'text'"
      class="bg-[#F2F2F2] rounded-base py-2 px-1 w-full"
      :placeholder="placeholder ?? 'Enter text'"
      v-model="model"
    />
    <div v-if="type == 'number'">
      <span class="absolute right-8 top-1/2 transform -translate-y-1/2 text-black/50">%</span>
    </div>
  </div>
</template>
