<script setup lang="ts">
import { Funnel, LoaderCircle, ArrowLeftRight } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { fetchWithAuth } from '@/fetchWithAuth'
import { ApiEndpoints } from '@/enums/APIEndpoints'
import { Transaction } from '@shared/Transaction'
import { RouteNames } from '@/router'
import { getLastWeekStart, getThisWeekStart, getYesterday } from '@/date'
import AddTransactionPopup from '@/components/popups/AddTransactionPopup.vue'
import EditTransactionPopup from '@/components/popups/EditTransactionPopup.vue'
import BackButton from '@/components/BackButton.vue'
import MonthlyTransactionsBalance from '@/components/MonthlyTransactionsBalance.vue'
import TransactionGroup from '@/components/TransactionGroup.vue'
import Button from '@/components/Button.vue'
import AddTransferPopup from '@/components/popups/AddTransferPopup.vue'
import EditTransferPopup from '@/components/popups/EditTransferPopup.vue'
import { TransactionTypes } from '@shared/TransactionTypes'

let showAddTransactionPopup = ref(false)
let showEditTransactionPopup = ref(false)
let showAddTransferPopup = ref(false)
let showEditTransferPopup = ref(false)
let transactionInEdit = ref<Transaction | null>(null)
let loading = ref(true)
let data = ref<Transaction[]>([])

onMounted(async () => {
  fetchTransactions().then(() => {
    loading.value = false
  })
})

async function onClose() {
  showAddTransactionPopup.value = false
  showEditTransactionPopup.value = false
  showAddTransferPopup.value = false
  showEditTransferPopup.value = false
  transactionInEdit.value = null
}

async function onAddedTransaction() {
  onClose()
  await fetchTransactions()
}

async function editTransaction(transaction: Transaction) {
  transactionInEdit.value = transaction

  if (transaction.type === TransactionTypes.TRANSFER) {
    showEditTransferPopup.value = true
  } else {
    showEditTransactionPopup.value = true
  }
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

const transactionsGroups = computed(() => {
  if (!data.value) return {} as Record<string, Transaction[]>

  const transactionsGroups: Record<string, Transaction[]> = {}

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = getYesterday()
  const thisWeekStart = getThisWeekStart()
  const lastWeekStart = getLastWeekStart()
  const formatter = new Intl.DateTimeFormat('en-CA', { month: 'long', day: 'numeric' })

  const getLabel = (date: Date): string => {
    const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (localMidnight.getTime() === today.getTime()) return 'Today'
    if (localMidnight.getTime() === yesterday.getTime()) return 'Yesterday'
    if (localMidnight >= thisWeekStart && localMidnight < today) return 'This Week'
    if (localMidnight >= lastWeekStart && localMidnight < thisWeekStart) return 'Last Week'

    return formatter.format(localMidnight)
  }

  let orderedTransactions = data.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  for (const transaction of orderedTransactions) {
    const date = new Date(transaction.date)
    const label = getLabel(date)
    transactionsGroups[label] ??= []
    transactionsGroups[label].push(transaction)
  }

  return transactionsGroups
})
</script>

<template>
  <AddTransactionPopup v-if="showAddTransactionPopup" @created="onAddedTransaction" />
  <EditTransactionPopup v-if="showEditTransactionPopup" :transaction="transactionInEdit!" @updated="onAddedTransaction" />
  <AddTransferPopup v-if="showAddTransferPopup" @created="onAddedTransaction" />
  <EditTransferPopup v-if="showEditTransferPopup" :transaction="transactionInEdit!" @updated="onAddedTransaction" />
  <div class="py-2 px-4">
    <BackButton :link="RouteNames.Dashboard" />
  </div>
  <div v-if="loading" class="flex items-center justify-center h-screen">
    <LoaderCircle class="w-12 h-12 text-green-500 animate-spin" />
  </div>
  <div class="pt-8" v-else>
    <MonthlyTransactionsBalance :transactions="data" />

    <div class="mt-16 flex flex-col gap-8 w-full px-4">
      <div v-for="(transactions, label) in transactionsGroups" :key="label">
        <TransactionGroup :label="label" :transactions="transactions" @delete="deleteTransaction" @edit="editTransaction" />
      </div>
      <div class="h-12"></div>
    </div>

    <div class="fixed bottom-0 flex w-full p-4 gap-3">
      <Button label="Add Transaction" class="flex-1 shadow-lg" @click="showAddTransactionPopup = true" />
      <Button class="!w-12 relative shadow-lg" @click="showAddTransferPopup = true">
        <div class="text-white absolute inset-0 flex items-center justify-center">
          <ArrowLeftRight :size="24" />
        </div>
      </Button>
      <Button class="!w-12 relative shadow-lg">
        <div class="text-white absolute inset-0 flex items-center justify-center">
          <Funnel :size="24" />
        </div>
      </Button>
    </div>
  </div>
</template>
