<script setup lang="ts">
import type { Transaction } from '@shared/Transaction'
import { ArrowLeftRight, CalendarSync, Car, Hamburger, House, PawPrint, PiggyBank, Store, Trash2, Utensils } from 'lucide-vue-next'
import { capitalizeOnlyFirstLetter } from '@/capitalize'
import { TransactionTypes } from '@shared/TransactionTypes'
import { Categories } from '@/enums/Categories'
import type { FunctionalComponent } from 'vue'
import { ref, useTemplateRef, watchEffect } from 'vue'
import { useSwipe } from '@vueuse/core'

const props = defineProps<{
  transaction: Transaction
}>()

const amount = `${Number(props.transaction.amount).toFixed(2)}$`

const color = props.transaction.amount > 0 ? 'text-green-500' : 'text-red-500'

const formattedDate = new Intl.DateTimeFormat('en-CA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date(props.transaction.date))

let icon: FunctionalComponent
let iconColor: string

if (props.transaction.type === TransactionTypes.TRANSFER) {
  icon = ArrowLeftRight
  iconColor = 'bg-green-500'
} else if (props.transaction.type === TransactionTypes.SAVING) {
  icon = PiggyBank
  iconColor = 'bg-blue-500'
} else {
  switch (props.transaction.category) {
    case Categories.CAR:
      icon = Car
      iconColor = 'bg-orange-100'
      break
    case Categories.FOOD:
      icon = Hamburger
      iconColor = 'bg-purple-100'
      break
    case Categories.HOUSING:
      icon = House
      iconColor = 'bg-red-400'
      break
    case Categories.PETS:
      icon = PawPrint
      iconColor = 'bg-teal-100'
      break
    case Categories.RESTAURANT:
      icon = Utensils
      iconColor = 'bg-yellow-100'
      break
    case Categories.SUBSCRIPTIONS:
      icon = CalendarSync
      iconColor = 'bg-green-100'
      break
    default:
      icon = Store
      iconColor = 'bg-blue-300'
  }
}

const emit = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'edit', transaction: Transaction): void
}>()

const card = useTemplateRef('card')
const translateX = ref(0)
const { isSwiping, direction, lengthX } = useSwipe(card, {
  passive: false,
  threshold: 10,
})

watchEffect(() => {
  if (isSwiping.value && direction.value === 'left') {
    translateX.value = -Math.abs(lengthX.value)
  } else {
    if (translateX.value < -150) {
      if (confirm('Are you sure you want to delete this transaction?')) {
        emit('delete', props.transaction.id)
      }
    }
    translateX.value = 0
  }
})
</script>

<template>
  <div class="relative overflow-hidden active:scale-95" @click="$emit('edit', props.transaction)">
    <div class="absolute inset-0 bg-red-500 text-white flex items-center justify-end pr-4 z-0">
      <Trash2 />
    </div>

    <div class="flex gap-3 transition-transform duration-100 bg-white" ref="card" :style="{ transform: `translateX(${translateX}px)` }">
      <div :class="`relative w-12 h-12 ${iconColor} rounded-base`">
        <div class="text-white absolute inset-0 flex items-center justify-center">
          <component :is="icon" size="24" :class="iconColor" stroke-width="2" />
        </div>
      </div>
      <div>
        <b class="text-black font-inter text-base">{{ capitalizeOnlyFirstLetter(props.transaction.vendor) }}</b>
        <div class="text-black/50 font-bold text-sm">{{ formattedDate }}</div>
      </div>
      <div :class="`${color} font-bold font-inter my-auto text-right flex-1`">{{ amount }}</div>
    </div>
  </div>
</template>
