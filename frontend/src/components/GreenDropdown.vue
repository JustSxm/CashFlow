<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'
import { ChevronsUpDown, FileQuestion } from 'lucide-vue-next'
import { type DropdownOption } from '@/models/DropdownOption'
import { capitalize } from '@/capitalize'
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  placeholder?: string
  options?: DropdownOption[]
  disable?: boolean
}>()
const model = defineModel<number | null>()

const open = ref(false)
const optionModel = ref<DropdownOption | null>(null)

function setDropdownValue(option: DropdownOption) {
  model.value = option.value
  optionModel.value = option
  open.value = false
}

function openDropdown() {
  if (!props.disable) {
    open.value = !open.value
  }
}

watch([() => model.value, () => props.options?.length], () => {
  const matched = props.options?.find((o) => o.value === model.value)
  if (matched) {
    optionModel.value = matched
  }
})

onMounted(() => {
  const dropdown = useTemplateRef<HTMLElement>('dropdownRef')
  onClickOutside(dropdown, () => {
    open.value = false
  })
})
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
      <FileQuestion v-if="!optionModel" class="text-black" :size="16" strokeWidth="1" />
      <component v-else :is="optionModel.icon" class="text-black" strokeWidth="1" size="16" />
    </div>
    <div
      :class="[
        `border border-green-500 text-black rounded-base w-full pl-10 font-inter h-12 flex items-center ${disable ? 'bg-gray-100' : ''}`,
      ]"
      @click="openDropdown"
    >
      <span v-if="!optionModel" class="text-black/50 font-inter">{{ props.placeholder || 'Enter text' }}</span>
      <span v-else class="text-black font-inter">{{ capitalize(optionModel.label) }}</span>
      <ChevronsUpDown class="text-green-500 w-6 h-6 ml-auto mr-2" />
    </div>
    <div v-if="open" class="absolute z-10 w-full bg-white border border-green-500 rounded-base shadow-lg mt-1">
      <div v-for="option in props.options" :key="option.value" @click="setDropdownValue(option)">
        <div class="relative">
          <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
            <component :is="option.icon" class="w-4 h-4" />
          </div>
          <div class="text-black rounded-base w-full pl-10 font-inter h-12 flex items-center" @click="open = !open">
            <span class="text-black font-inter">{{ capitalize(option.label) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input {
  height: 48px;
}
</style>
