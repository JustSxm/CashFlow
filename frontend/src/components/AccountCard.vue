<script setup lang="ts">
import type { Account } from '@shared/Account'
import { AccountTypes } from '@shared/AccountTypes'
import { PiggyBank, CreditCard, Trash2 } from 'lucide-vue-next'
import { capitalize } from '@/capitalize'
import { ref, useTemplateRef, watchEffect } from 'vue'
import { useSwipe } from '@vueuse/core'

const props = defineProps<{
  account: Account
}>()

const emit = defineEmits<{
  (e: 'edit', account: Account): void
  (e: 'delete', account: Account): void
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
      if (confirm('Are you sure you want to delete this account?')) {
        emit('delete', props.account)
      }
    }
    translateX.value = 0
  }
})
</script>

<template>
  <div class="relative">
    <div class="absolute inset-1 overflow-hidden bg-red-500 text-white flex items-center justify-end pr-4 rounded-2xl -z-10">
      <Trash2 />
    </div>
    <div
      class="w-full h-32 rounded-2xl shadow-[1px_3px_0px_0px_rgba(0,0,0,0.25)]"
      @click="emit('edit', account)"
      ref="card"
      :style="{ transform: `translateX(${translateX}px)` }"
    >
      <div class="w-full h-32 rounded-2xl px-6 py-8 flex gap-6 items-center bg-white shadow-[0px_3px_20px_0px_rgba(0,0,0,0.25)]">
        <div class="w-12 h-12 bg-green-400 rounded-base flex items-center justify-center" v-if="account.type == AccountTypes.CHECKING">
          <PiggyBank class="text-white w-6 h-6" strokeWidth="1" />
        </div>
        <div class="w-12 h-12 bg-blue-300 rounded-base flex items-center justify-center" v-else>
          <CreditCard class="text-white w-6 h-6" strokeWidth="1" />
        </div>
        <div class="flex flex-col justify-center">
          <span class="text-black/50 text-sm font-inter">Account</span>
          <span class="font-inter font-medium">{{ capitalize(account.name) }}</span>
        </div>
        <div class="flex flex-col justify-center ml-auto">
          <span class="text-black/50 text-sm font-inter">Balance</span>
          <span class="font-inter font-medium text-right">{{ Number(props.account.balance).toFixed(2) }} $</span>
        </div>
        <div v-if="account.limit" class="flex flex-col justify-center">
          <span class="text-black/50 text-sm font-inter">Limit</span>
          <span class="font-inter font-medium text-right">{{ Number(props.account.limit).toFixed(2) }} $</span>
        </div>
      </div>
    </div>
  </div>
</template>
