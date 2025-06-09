<script setup lang="ts">
const props = defineProps<{
  type?: string
}>()

const type = props.type ?? 'text'
const model = defineModel<string>({
  default: '',
  type: String,
  required: false,
})
</script>

<template>
  <div class="relative">
    <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
      <slot></slot>
    </div>
    <input
      :type="type"
      v-model="model"
      class="border border-1 border-green-500 text-black rounded-base w-full pl-10"
    />
  </div>
</template>

<style scoped>
input {
  height: 48px;
}
</style>
