<script setup lang="ts">
import TransactionGraph from '@/components/TransactionGraph.vue'
import TransactionGroup from '@/components/TransactionGroup.vue'
import Button from '@/components/Button.vue'
import { ArrowUp, ArrowDown, Funnel, LoaderCircle } from 'lucide-vue-next'
import AddTransactionPopup from '@/components/popups/AddTransactionPopup.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { fetchWithAuth } from '@/fetchWithAuth'
import { ApiEndpoints } from '@/enums/APIEndpoints'
import type { GroupedTransactions, Transaction } from '@shared/Transaction'
import { TransactionTypes } from '@shared/TransactionTypes'
import BackButton from '@/components/BackButton.vue'
import { RouteNames } from '@/router'

let showAddTransactionPopup = ref(false)
let loading = ref(true)
let data = ref<Transaction[] | null>(null)
let transactionsSince1st = ref<Transaction[] | null>(null)
let transactionInEditMode = ref<Transaction | undefined>(undefined)

let since1st = computed(() => {
  if (!data.value) return 'Loading...'

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const firstOfMonth = new Date(currentYear, currentMonth, 1)

  let filteredtransactionsSince1st = data.value.filter((transaction) => new Date(transaction.date) >= firstOfMonth)
  transactionsSince1st.value = filteredtransactionsSince1st

  let total = filteredtransactionsSince1st.reduce((sum, transaction) => {
    return sum + Number(transaction.amount)
  }, 0)

  let returnTotal
  if (total > 0) {
    returnTotal = '+' + total.toFixed(2)
  } else {
    returnTotal = total.toFixed(2)
  }

  return returnTotal
})

let up = computed(() => {
  return since1st.value.startsWith('+')
})

onMounted(async () => {
  try {
    fetchTransactions()
  } finally {
    loading.value = false
  }
})

async function close() {
  showAddTransactionPopup.value = false
  transactionInEditMode.value = undefined
  await fetchTransactions()
}

async function fetchTransactions() {
  const response = await fetchWithAuth(ApiEndpoints.TRANSACTIONS)
  data.value = await response.json()
}

async function deleteTransaction(id: number) {
  const response = await fetchWithAuth(`${ApiEndpoints.TRANSACTIONS}/${id}`, {
    method: 'DELETE',
  })

  data.value = await response.json()
}

async function editTransaction(transaction: Transaction) {
  transactionInEditMode.value = transaction
  showAddTransactionPopup.value = true
}

function groupTransactionsByRelativeDate(transactions: Transaction[]): GroupedTransactions {
  const now = new Date()
  const todayStart = new Date(now.setHours(0, 0, 0, 0))
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)

  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - todayStart.getDay()) // Start of current week (Sunday)

  const lastWeekStart = new Date(weekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)

  const lastWeekEnd = new Date(weekStart)
  lastWeekEnd.setMilliseconds(-1) // End of last week (Saturday night)

  const formatter = new Intl.DateTimeFormat('en-CA', { month: 'long', day: 'numeric' })

  const grouped: GroupedTransactions = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    'Last Week': [],
    Other: {},
  }

  for (const tx of transactions) {
    const txDate = new Date(tx.date)
    const txMidnight = new Date(txDate.setHours(0, 0, 0, 0))

    if (txMidnight.getTime() === todayStart.getTime()) {
      grouped.Today.push(tx)
    } else if (txMidnight.getTime() === yesterdayStart.getTime()) {
      grouped.Yesterday.push(tx)
    } else if (txMidnight >= weekStart && txMidnight < todayStart) {
      grouped['This Week'].push(tx)
    } else if (txMidnight >= lastWeekStart && txMidnight <= lastWeekEnd) {
      grouped['Last Week'].push(tx)
    } else {
      const label = formatter.format(txMidnight)
      if (!grouped.Other[label]) {
        grouped.Other[label] = []
      }
      grouped.Other[label].push(tx)
    }
  }

  return grouped
}

let groupedTransactions = computed(() => {
  if (!data.value) return { Today: [], Yesterday: [], 'This Week': [], 'Last Week': [], Other: {} }
  let ordered = data.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return groupTransactionsByRelativeDate(ordered)
})
</script>

<template>
  <AddTransactionPopup v-if="showAddTransactionPopup" :onClose="close" :transaction="transactionInEditMode" />
  <div class="py-2 px-4">
    <BackButton :link="RouteNames.Dashboard" />
  </div>
  <div v-if="loading" class="flex items-center justify-center h-screen">
    <LoaderCircle class="w-12 h-12 text-green-500 animate-spin" />
  </div>
  <div class="pt-8" v-else>
    <div class="flex flex-col items-center gap-1">
      <span class="flex gap-1 text-center font-inter text-green-200" v-if="up">Up <ArrowUp width="16" stroke-width="2" /></span>
      <span class="flex gap-1 text-center font-inter text-red-200" v-else>Down <ArrowDown width="16" stroke-width="2" /></span>
      <span :class="up ? 'text-4xl text-green-500 font-montserrat' : 'text-4xl text-red-500 font-montserrat'"
        ><b>{{ since1st }}$</b></span
      >
      <span :class="[up ? 'text-green-200' : 'text-red-200', 'flex gap-1 text-center font-inter']"
        >Since {{ new Date().toLocaleString('en-US', { month: 'long' }) }} 1st</span
      >
      <div class="h-16 w-full mt-2">
        <TransactionGraph :up="up" :transactions="transactionsSince1st ?? []" />
      </div>
    </div>

    <div class="mt-16 flex flex-col gap-8 w-full px-4">
      <TransactionGroup label="Today" :transactions="groupedTransactions.Today" :onDelete="deleteTransaction" :onEdit="editTransaction" />
      <TransactionGroup
        label="Yesterday"
        :transactions="groupedTransactions.Yesterday"
        :onDelete="deleteTransaction"
        :onEdit="editTransaction"
      />
      <TransactionGroup
        label="This Week"
        :transactions="groupedTransactions['This Week']"
        :onDelete="deleteTransaction"
        :onEdit="editTransaction"
      />
      <TransactionGroup
        label="Last Week"
        :transactions="groupedTransactions['Last Week']"
        :onDelete="deleteTransaction"
        :onEdit="editTransaction"
      />
      <div v-for="(transactions, label) in groupedTransactions.Other" :key="label">
        <TransactionGroup :label="label" :transactions="transactions" :onDelete="deleteTransaction" :onEdit="editTransaction" />
      </div>
      <div class="h-12"></div>
    </div>

    <div class="fixed bottom-0 flex w-full p-4 gap-3">
      <Button label="Add Transaction" class="flex-1 shadow-lg" @click="showAddTransactionPopup = true" />
      <Button class="!w-12 relative shadow-lg">
        <div class="text-white absolute inset-0 flex items-center justify-center">
          <Funnel :size="24" />
        </div>
      </Button>
    </div>
  </div>
</template>
