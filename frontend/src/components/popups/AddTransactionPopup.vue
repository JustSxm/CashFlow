<script setup lang="ts">
import { ref } from 'vue'
import FormLabel from '../FormLabel.vue'
import GreenInput from '../GreenInput.vue'
import Pill from '../Pill.vue'
import { Store, Coins, Upload } from 'lucide-vue-next'
import Button from '../Button.vue'
import RedButton from '../RedButton.vue'
import { TransactionTypes } from '@/enums/TransactionTypes'
import { Categories } from '@/enums/Categories'

let props = defineProps<{
  onClose: () => void
}>()

let vendor = ref('')
let amount = ref('')
let type = ref('')
let category = ref('')

function onCategoryChanged(value: string) {
  category.value = value
}

function createTransaction() {
  if (!vendor.value || !amount.value || !type.value || !category.value) {
    alert('Please fill in all fields.')
    return
  }

  const transaction = {
    vendor: vendor.value,
    amount: parseFloat(amount.value.replace(/[^0-9.-]+/g, '')),
    type: type.value,
    category: category.value,
  }

  console.log('Transaction created:', transaction)

  vendor.value = ''
  amount.value = ''
  type.value = ''
  category.value = ''

  props.onClose()
}
</script>

<template>
  <div class="bg-black/50 fixed inset-0 z-40 flex items-center justify-center">
    <div class="absolute bg-white h-auto w-96 border-t-6 border-green-400 mx-auto z-50 p-6">
      <h1 class="text-xl text-center font-medium">Add Transaction</h1>
      <div class="flex flex-col gap-6 mt-6">
        <div class="px-4">
          <FormLabel label="Vendor"></FormLabel>
          <GreenInput v-model="vendor">
            <Store :size="16" strokeWidth="1" />
          </GreenInput>
        </div>
        <div class="px-4">
          <FormLabel label="Amount"></FormLabel>
          <GreenInput v-model="amount" type="money">
            <Coins :size="16" strokeWidth="1" />
          </GreenInput>
        </div>
        <div class="px-4">
          <FormLabel label="Type"></FormLabel>
          <div class="flex w-full gap-3">
            <div
              :class="[
                type == TransactionTypes.EXPENSE ? 'bg-red-200 text-red-900 border-red-200' : 'bg-red-900 text-red-200 border-red-500',
                ' h-8 px-3 py-1.5 flex justify-center items-center border rounded-base w-full cursor-pointer transition-colors duration-200',
              ]"
              @click="type = TransactionTypes.EXPENSE"
            >
              <Upload :size="16" strokeWidth="2" class="inline-block mr-1" />
              Expense
            </div>
            <div
              :class="[
                type == TransactionTypes.INCOME
                  ? 'bg-green-200 text-green-900 border-green-200'
                  : 'bg-green-900 text-green-200 border-green-500',
                ' h-8 px-3 py-1.5  flex justify-center items-center border rounded-base w-full cursor-pointer duration-200',
              ]"
              @click="type = TransactionTypes.INCOME"
            >
              <Upload :size="16" strokeWidth="2" class="inline-block mr-1" />
              Income
            </div>
          </div>
        </div>
        <div class="px-4">
          <FormLabel label="Category"></FormLabel>
          <div class="flex flex-wrap gap-1">
            <Pill
              label="Restaurant"
              :value="Categories.RESTAURANT"
              :selected="category == Categories.RESTAURANT"
              @click="onCategoryChanged"
            />
            <Pill label="Pets" :value="Categories.PETS" :selected="category == Categories.PETS" @click="onCategoryChanged" />
            <Pill label="Car" :value="Categories.CAR" :selected="category == Categories.CAR" @click="onCategoryChanged" />
            <Pill label="Housing" :value="Categories.HOUSING" :selected="category == Categories.HOUSING" @click="onCategoryChanged" />
            <Pill label="Food" :value="Categories.FOOD" :selected="category == Categories.FOOD" @click="onCategoryChanged" />
            <Pill
              label="Subscription"
              :value="Categories.SUBSCRIPTIONS"
              :selected="category == Categories.SUBSCRIPTIONS"
              @click="onCategoryChanged"
            />
            <Pill label="Other" :value="Categories.OTHER" :selected="category == Categories.OTHER" @click="onCategoryChanged" />
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <RedButton label="Cancel" class="w-full" @click="onClose" />
          <Button label="Created" class="w-full" @click="createTransaction" />
        </div>
      </div>
    </div>
  </div>
</template>
