<script setup lang="ts">
import { onMounted, watch } from 'vue'

const props = defineProps<{
  type?: string
}>()

const model = defineModel<string>()

let type = props.type ?? 'text'

const isMoney = props.type === 'money'
let min = undefined

function formatMoney(digits: string): string {
  if (!digits) return ''

  const cleaned = digits.replace(/\D/g, '').padStart(3, '0')
  const int = cleaned.slice(0, -2)
  const dec = cleaned.slice(-2)

  return `${parseInt(int, 10)}.${dec}`
}

function onInput(event: Event) {
  if (!isMoney) return
  const inputEvent = event as InputEvent

  const input = event.target as HTMLInputElement
  let raw = input.value.replace(/\D/g, '')

  if (inputEvent.inputType === 'deleteContentBackward') {
    if (raw.length >= 0) {
      raw = raw.slice(0, -1)
    }
  }

  const formatted = formatMoney(raw)

  model.value = `${formatted} $`
  input.value = `${formatted} $`
}

onMounted(() => {
  if (isMoney) {
    model.value = `${formatMoney(model.value != '' ? model.value! : '0')} $`
  }
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
      class="border border-green-500 text-black rounded-base w-full pl-10 font-inter"
      :min="min"
      @input="onInput"
    />
  </div>
</template>

<style scoped>
input {
  height: 48px;
}
</style>
