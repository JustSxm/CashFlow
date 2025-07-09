<script setup lang="ts">
import Transaction from '@/components/Transaction.vue'
import type { Transaction as TransactionType } from '@shared/Transaction'

defineProps<{
  label?: string
  transactions?: TransactionType[]
}>()

const emit = defineEmits<{
  (e: 'delete', transactionId: number): void
  (e: 'edit', transaction: TransactionType): void
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
      <Transaction :transaction="transaction" @delete="emit('delete', transaction.id)" @edit="emit('edit', transaction)" />
    </div>
  </div>
</template>
