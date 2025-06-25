<script setup lang="ts">
import TransactionGraph from '@/components/TransactionGraph.vue'
import TransactionGroup from '@/components/TransactionGroup.vue'
import Button from '@/components/Button.vue'
import { ArrowUp, Funnel } from 'lucide-vue-next'
import AddTransactionPopup from '@/components/popups/AddTransactionPopup.vue'
import { ref } from 'vue'

let showAddTransactionPopup = ref(false)

function close() {
  showAddTransactionPopup.value = false
}
</script>

<template>
  <AddTransactionPopup v-if="showAddTransactionPopup" :onClose="close" />
  <div class="pt-16 text-green-200">
    <div class="flex flex-col items-center gap-1">
      <span class="flex gap-1 text-center font-inter font-light">Up <ArrowUp width="16" stroke-width="2" /></span>
      <span class="text-4xl text-green-500 font-montserrat"><b>+29,000.89$</b></span>
      <span class="flex gap-1 text-center font-inter font-light">Since May 1st</span>
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
