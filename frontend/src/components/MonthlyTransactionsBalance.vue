<script setup lang="ts">
import { getFirstDayOfMonth } from '@/date'
import type { Transaction } from '@shared/Transaction'
import { ArrowUp, ArrowDown } from 'lucide-vue-next'
import { computed } from 'vue'
import TransactionGraph from './TransactionGraph.vue'

const props = defineProps<{
  transactions: Transaction[]
}>()

const monthlyTransactions = computed(() => {
  if (!props.transactions) return []

  return props.transactions.filter((transaction) => new Date(transaction.date) >= getFirstDayOfMonth())
})

const monthlyBalance = computed(() => {
  if (!monthlyTransactions.value) return 'Loading...'

  let total = monthlyTransactions.value.reduce((sum, transaction) => {
    return sum + Number(transaction.amount)
  }, 0)

  if (total > 0) {
    return '+' + total.toFixed(2)
  }

  return total.toFixed(2)
})

const isMonthlyBalancePositive = computed(() => {
  return monthlyBalance.value.startsWith('+')
})
</script>
<template>
  <div class="flex flex-col items-center gap-1">
    <span class="flex gap-1 text-center font-inter text-green-200" v-if="isMonthlyBalancePositive"
      >Up <ArrowUp width="16" stroke-width="2"
    /></span>
    <span class="flex gap-1 text-center font-inter text-red-200" v-else>Down <ArrowDown width="16" stroke-width="2" /></span>
    <span :class="isMonthlyBalancePositive ? 'text-4xl text-green-500 font-montserrat' : 'text-4xl text-red-500 font-montserrat'"
      ><b>{{ monthlyBalance }}$</b></span
    >
    <span :class="[isMonthlyBalancePositive ? 'text-green-200' : 'text-red-200', 'flex gap-1 text-center font-inter']"
      >Since {{ new Date().toLocaleString('en-US', { month: 'long' }) }} 1st</span
    >
    <div class="h-16 w-full mt-2">
      <TransactionGraph :up="isMonthlyBalancePositive" :transactions="monthlyTransactions ?? []" />
    </div>
  </div>
</template>
