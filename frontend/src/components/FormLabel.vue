<script setup lang="ts">
import { Asterisk } from 'lucide-vue-next'

const props = defineProps<{
  label?: string
  required?: boolean
}>()

const label = props.label ?? 'Default Label'
const required = props.required ?? false
</script>

<template>
  <label class="font-inter text-black/50 font-medium flex mb-1">
    {{ label }}
    <span class="text-red-500" v-if="!required">
      <Asterisk x-if="required" :size="12" class="mt-1"></Asterisk>
    </span>
  </label>
</template>
