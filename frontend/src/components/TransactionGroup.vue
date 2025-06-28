<script setup lang="ts">
import Transaction from '@/components/Transaction.vue'
import type { Transaction as TransactionType } from '@shared/Transaction'

const props = defineProps<{
  label?: string
  transactions?: TransactionType[]
  onDelete?: (transactionId: number) => void
  onEdit?: (transaction: TransactionType) => void
}>()
</script>

<template>
  <div class="flex flex-col gap-3 w-full" v-if="transactions && transactions.length > 0">
    <span class="text-left w-full font-inter text-black/50 font-semibold">{{ label }}</span>
    <div
      class="flex flex-col gap-3"
      v-for="transaction in transactions"
      :key="transaction.id + transaction.amount + transaction.type + transaction.category + transaction.vendor + transaction.account_id"
    >
      <Transaction :transaction="transaction" @delete="onDelete" @edit="onEdit" />
    </div>
  </div>
</template>
