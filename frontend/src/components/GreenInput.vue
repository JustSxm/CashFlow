<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type?: string
}>()

const model = defineModel()

let type = props.type ?? 'text'

const isMoney = props.type === 'money'
let min = undefined

if (isMoney) {
  type = 'number'
  min = 0
}

function onInput(event: Event) {
  let modifiedValue = 'a'
  model.value = modifiedValue
}
</script>

<template>
  <div class="relative">
    <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
      <slot></slot>
    </div>
    <input :type="type" v-model="model" class="border border-green-500 text-black rounded-base w-full pl-10" :min="min" @input="onInput" />
  </div>
</template>

<style scoped>
input {
  height: 48px;
}
</style>
