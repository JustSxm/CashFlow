<script setup lang="ts">
import { DollarSign, MoveRight, PiggyBank, House, ChartColumnStacked, Settings } from 'lucide-vue-next'
import { onMounted, ref, computed } from 'vue'
import { fetchWithAuth } from '@/fetchWithAuth'
import { getOrdinal } from '@/date'
import { capitalize } from '@/capitalize'
import { ApiEndpoints } from '@/enums/APIEndpoints'
import { DateFilters } from '@/enums/DateFilter'
import type { Transaction as TransactionType } from '@shared/Transaction'
import { TransactionTypes } from '@shared/TransactionTypes'
import Transaction from '@/components/Transaction.vue'
import Pill from '@/components/Pill.vue'
import type { Settings as SettingsType } from '@shared/Settings'

let data = ref<TransactionType[] | null>(null)
let lastThreeTransactions = ref<TransactionType[]>([])
let selectedFilter = ref()
let startOfWeek = ref(1)
const transactionsInFilter = ref<TransactionType[]>([])

let totalIncome = computed(() => {
  const transactions = transactionsInFilter.value
  if (!transactions || transactions.length === 0) return 0
  return transactionsInFilter.value
    .filter((transaction) => transaction.type === TransactionTypes.INCOME)
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0)
})

let totalSpendings = computed(() => {
  const transactions = transactionsInFilter.value
  if (!transactions || transactions.length === 0) return 0
  return transactionsInFilter.value
    .filter((transaction) => transaction.type === TransactionTypes.EXPENSE)
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0)
})

const categoryWithMostSpendings = computed(() => {
  const transactions = transactionsInFilter.value
  if (!transactions || transactions.length === 0) return 'None'

  const grouped: Record<string, number> = {}

  for (const transaction of transactions) {
    if (transaction.type !== TransactionTypes.EXPENSE) continue
    console.log('Processing transaction:', transaction)
    const category = transaction.category
    grouped[category] = (grouped[category] || 0) + -Number(transaction.amount)
    console.log(`Category: ${category}, Amount: ${transaction.amount}, Total: ${grouped[category]}`)
  }

  const maxCategory = Object.entries(grouped).reduce((max, current) => (current[1] > max[1] ? current : max), ['', 0])[0]

  return capitalize(maxCategory) || 'None'
})

const incomeLeftRatio = computed(() => {
  if (totalIncome.value === 0) return 0
  console.log('Total Income:', totalIncome.value, 'Total Spendings:', totalSpendings.value)
  console.log(Math.max(0, Math.min(1, (totalIncome.value - totalSpendings.value) / totalIncome.value)))
  return Math.max(0, Math.min(1, (totalIncome.value + totalSpendings.value) / totalIncome.value))
})

async function fetchTransactions() {
  const response = await fetchWithAuth(ApiEndpoints.TRANSACTIONS)
  var transactions: TransactionType[] = await response.json()

  data.value = transactions
  lastThreeTransactions.value = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
  onFilterChanged(selectedFilter.value)
}

async function onFilterChanged(filter: string) {
  selectedFilter.value = filter
  if (!data.value) return

  const today = new Date()

  // startOfWeek (the end date is the next based on settings) ex: if startOfWeek is 1 (Monday), the end date will be the upcoming Monday
  const startOfWeekOffset = (today.getDay() + 7 - startOfWeek.value) % 7
  today.setDate(today.getDate() + startOfWeekOffset)

  const oneWeekAgo = new Date(today)
  oneWeekAgo.setDate(today.getDate() - 7)

  const twoWeeksAgo = new Date(today)
  twoWeeksAgo.setDate(today.getDate() - 14)

  const oneMonthAgo = new Date(today)
  oneMonthAgo.setMonth(today.getMonth() - 1)

  const threeMonthsAgo = new Date(today)
  threeMonthsAgo.setMonth(today.getMonth() - 3)

  const sixMonthsAgo = new Date(today)
  sixMonthsAgo.setMonth(today.getMonth() - 6)

  const oneYearAgo = new Date(today)
  oneYearAgo.setFullYear(today.getFullYear() - 1)

  switch (filter) {
    case DateFilters.WEEK:
      transactionsInFilter.value = data.value.filter((transaction) => new Date(transaction.date) >= oneWeekAgo)
      break
    case DateFilters.TWO_WEEKS:
      transactionsInFilter.value = data.value.filter((transaction) => new Date(transaction.date) >= twoWeeksAgo)
      break
    case DateFilters.MONTH:
      transactionsInFilter.value = data.value.filter((transaction) => new Date(transaction.date) >= oneMonthAgo)
      break
    case DateFilters.THREE_MONTHS:
      transactionsInFilter.value = data.value.filter((transaction) => new Date(transaction.date) >= threeMonthsAgo)
      break
    case DateFilters.SIX_MONTHS:
      transactionsInFilter.value = data.value.filter((transaction) => new Date(transaction.date) >= sixMonthsAgo)
      break
    case DateFilters.YEAR:
      transactionsInFilter.value = data.value.filter((transaction) => new Date(transaction.date) >= oneYearAgo)
      break
    default:
      transactionsInFilter.value = data.value
  }
}

const dateRangeLabel = computed(() => {
  const end = new Date()
  let start = new Date()

  // startOfWeek (the end date is the next based on settings) ex: if startOfWeek is 1 (Monday), the end date will be the upcoming Monday
  const startOfWeekOffset = (end.getDay() + 7 - startOfWeek.value) % 7
  end.setDate(end.getDate() + startOfWeekOffset)

  switch (selectedFilter.value) {
    case DateFilters.WEEK:
      start.setDate(end.getDate() - 6)
      break
    case DateFilters.TWO_WEEKS:
      start.setDate(end.getDate() - 13)
      break
    case DateFilters.MONTH:
      start.setMonth(end.getMonth() - 1)
      break
    case DateFilters.THREE_MONTHS:
      start.setMonth(end.getMonth() - 3)
      break
    case DateFilters.SIX_MONTHS:
      start.setMonth(end.getMonth() - 6)
      break
    case DateFilters.YEAR:
      start.setFullYear(end.getFullYear() - 1)
      break
    case DateFilters.ALL:
      return 'All time'
  }

  const startDay = getOrdinal(start.getDate())
  const endDay = getOrdinal(end.getDate())
  const sameMonth = start.getMonth() === end.getMonth()
  const startMonth = start.toLocaleString('en-US', { month: 'short' })
  const endMonth = end.toLocaleString('en-US', { month: 'short' })

  return sameMonth ? `${startDay} - ${endDay} ${endMonth}` : `${startDay} ${startMonth} - ${endDay} ${endMonth}`
})

async function fetchSettings() {
  const response = await fetchWithAuth(ApiEndpoints.SETTINGS)
  const settings: SettingsType = await response.json()
  let settingsStartOfWeek = settings.start_of_the_week || 1 // Default to Monday
  let settingsDefaultDashboardView = settings.default_dashboard_view || 1 // Default to 1 Week

  switch (settingsDefaultDashboardView) {
    case 1:
      selectedFilter.value = DateFilters.WEEK
      break
    case 2:
      selectedFilter.value = DateFilters.TWO_WEEKS
      break
    case 3:
      selectedFilter.value = DateFilters.MONTH
      break
    case 4:
      selectedFilter.value = DateFilters.THREE_MONTHS
      break
    case 5:
      selectedFilter.value = DateFilters.SIX_MONTHS
      break
    case 6:
      selectedFilter.value = DateFilters.YEAR
      break
    default:
      selectedFilter.value = DateFilters.ALL
  }
  startOfWeek.value = settingsStartOfWeek
  onFilterChanged(selectedFilter.value)
}

onMounted(() => {
  fetchTransactions()
  fetchSettings()
})
</script>

<template>
  <div class="flex w-full justify-end px-3 mt-2 mb-2 items-center">
    <div @click="$router.push('/settings')" class="flex items-center cursor-pointer">
      <Settings class="text-green-500 cursor-pointer" strokeWidth="2" />
      <span class="text-green-500 font-inter text-sm ml-2">Settings</span>
    </div>
  </div>
  <div class="px-3 py-2 flex flex-col gap-3">
    <div class="flex overflow-auto flex-nowrap gap-2 no-scrollbar">
      <div v-for="filter in Object.values(DateFilters)" :key="filter" class="text-nowrap">
        <Pill :label="filter" :value="filter" :selected="selectedFilter == filter" @click="onFilterChanged" />
      </div>
    </div>
    <div class="bg-green-600 w-full px-3 py-3 rounded-xl flex flex-col gap-6 shadow-xl">
      <div>
        <h1 class="font-inter text-lg text-white">Summary</h1>
        <h2 class="font-inter text-black/50 text-base">{{ dateRangeLabel }}</h2>
      </div>
      <div class="flex flex-col gap-3">
        <h1 class="font-inter text-white font-bold text-3xl">{{ Math.max(0, totalIncome + totalSpendings) }} $</h1>
        <div class="h-2 relative">
          <div class="bg-white/50 h-full rounded-full w-full"></div>
          <div class="bg-green-100 h-full rounded-full absolute top-0 left-0" :style="{ width: `${incomeLeftRatio * 100}%` }"></div>
        </div>
        <div class="font-inter text-white text-sm">Net Balance</div>
      </div>
    </div>

    <div class="flex gap-3">
      <div class="w-1/2 flex flex-col gap-1 p-3 shadow-xl rounded-xl bg-white border border-black/5">
        <div class="w-12 h-12 bg-red-900 rounded-full flex justify-center items-center">
          <DollarSign class="text-red-200" strokeWidth="1" />
        </div>
        <h1 class="font-inter text-black/50 text-base">Spendings</h1>
        <div class="flex items-center justify-between">
          <h2 class="font-inter text-black text-lg font-bold">{{ -totalSpendings }} $</h2>
          <MoveRight class="text-black" strokeWidth="1" />
        </div>
      </div>
      <div class="w-1/2 flex flex-col gap-1 p-3 shadow-xl rounded-xl bg-white border border-black/5">
        <div class="w-12 h-12 bg-green-900 rounded-full flex justify-center items-center">
          <PiggyBank class="text-green-200" strokeWidth="1" />
        </div>
        <h1 class="font-inter text-black/50 text-base">Earnings</h1>
        <div class="flex items-center justify-between">
          <h2 class="font-inter text-black text-lg font-bold">{{ totalIncome }} $</h2>
          <MoveRight class="text-black" strokeWidth="1" />
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <div class="w-1/2 flex flex-col gap-1 p-3 shadow-xl rounded-xl bg-white border border-black/5">
        <div class="w-12 h-12 bg-blue-200 rounded-full flex justify-center items-center">
          <House class="text-blue-900" strokeWidth="1" />
        </div>
        <h1 class="font-inter text-black/50 text-base">Savings</h1>
        <div class="flex items-center justify-between">
          <h2 class="font-inter text-black text-lg font-bold">-- $</h2>
          <MoveRight class="text-black" strokeWidth="1" />
        </div>
      </div>
      <div class="w-1/2 flex flex-col gap-1 p-3 shadow-xl rounded-xl bg-white border border-black/5">
        <div class="w-12 h-12 bg-pink-200 rounded-full flex justify-center items-center">
          <ChartColumnStacked class="text-pink-900" strokeWidth="1" />
        </div>
        <h1 class="font-inter text-black/50 text-base">Categories</h1>
        <div class="flex items-center justify-between">
          <h2 class="font-inter text-black text-lg font-bold">{{ categoryWithMostSpendings }}</h2>
          <MoveRight class="text-black" strokeWidth="1" />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1 p-3 shadow-xl rounded-xl bg-white border border-black/5">
      <div class="flex justify-between">
        <h1 class="font-inter text-lg">Transactions</h1>
        <h2 class="font-inter text-green-500 text-base"><RouterLink to="/transactions">See All </RouterLink></h2>
      </div>
      <div v-for="transaction in lastThreeTransactions" class="mt-2">
        <Transaction :transaction="transaction" />
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
