<script setup lang="ts">
import type { Account } from '@shared/Account'
import { AccountTypes } from '@shared/AccountTypes'
import { PiggyBank, CreditCard } from 'lucide-vue-next'

const props = defineProps<{
  account: Account
}>()

function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase()
}
</script>

<template>
  <div class="w-full h-32 rounded-2xl shadow-[1px_3px_0px_0px_rgba(0,0,0,0.25)]">
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
        <span class="font-inter font-medium text-right">{{ account.balance }} $</span>
      </div>
      <div v-if="account.limit" class="flex flex-col justify-center">
        <span class="text-black/50 text-sm font-inter">Limit</span>
        <span class="font-inter font-medium text-right">{{ account.limit }} $</span>
      </div>
    </div>
  </div>
</template>
