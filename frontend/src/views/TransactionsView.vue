<script setup lang="ts">
import TransactionGraph from '@/components/TransactionGraph.vue'
import TransactionGroup from '@/components/TransactionGroup.vue'
import Button from '@/components/Button.vue'
import { ArrowUp, ArrowDown, Funnel, LoaderCircle } from 'lucide-vue-next'
import AddTransactionPopup from '@/components/popups/AddTransactionPopup.vue'
import { computed, onMounted, ref } from 'vue'
import { fetchWithAuth } from '@/fetchWithAuth'
import { ApiEndpoints } from '@/enums/APIEndpoints'
import type { Transaction } from '@shared/Transaction'
import { TransactionTypes } from '@shared/TransactionTypes'

let showAddTransactionPopup = ref(false)
let loading = ref(true)
let data = ref<Transaction[] | null>(null)
let transactionsSince1st = ref<Transaction[] | null>(null)

let since1st = computed(() => {
  if (!data.value) return 'Loading...'

  // Calculate the total amount since the 1st of the current month
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const firstOfMonth = new Date(currentYear, currentMonth, 1)

  console.log(firstOfMonth)
  console.log(data.value)
  let filteredtransactionsSince1st = data.value.filter((transaction) => new Date(transaction.date) >= firstOfMonth)
  transactionsSince1st.value = filteredtransactionsSince1st

  let total = filteredtransactionsSince1st.reduce((sum, transaction) => {
    return sum + (transaction.type === TransactionTypes.INCOME ? Number(transaction.amount) : -Number(transaction.amount))
  }, 0)

  total.toFixed(2)

  let returnTotal
  if (total > 0) {
    returnTotal = '+' + total
  } else {
    returnTotal = total.toString()
  }

  return returnTotal
})

let up = computed(() => {
  return since1st.value.startsWith('+')
})

onMounted(async () => {
  try {
    const response = await fetchWithAuth(ApiEndpoints.TRANSACTIONS)

    data.value = await response.json()
  } finally {
    loading.value = false
  }
})

function close() {
  showAddTransactionPopup.value = false
}
</script>

<template>
  <AddTransactionPopup v-if="showAddTransactionPopup" :onClose="close" />
  <div v-if="loading" class="flex items-center justify-center h-screen">
    <LoaderCircle class="w-12 h-12 text-green-500 animate-spin" />
  </div>
  <div class="pt-16" v-else>
    <div class="flex flex-col items-center gap-1">
      <span class="flex gap-1 text-center font-inter font-light text-green-200" v-if="up">Up <ArrowUp width="16" stroke-width="2" /></span>
      <span class="flex gap-1 text-center font-inter font-light text-red-200" v-else>Down <ArrowDown width="16" stroke-width="2" /></span>
      <span class="text-4xl text-red-500 font-montserrat"
        ><b>{{ since1st }}$</b></span
      >
      <span :class="[up ? 'text-green-200' : 'text-red-200', 'flex gap-1 text-center font-inter font-light']"
        >Since {{ new Date().toLocaleString('default', { month: 'long' }) }} 1st</span
      >
      <div class="h-16 w-full">
        <TransactionGraph />
      </div>
    </div>

    <div class="mt-16 flex flex-col gap-8 w-full px-12">
      <TransactionGroup />
      <TransactionGroup />
      <TransactionGroup />
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
