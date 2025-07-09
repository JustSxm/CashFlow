<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import FormLabel from '../FormLabel.vue'
import GreenInput from '../GreenInput.vue'
import GreenDropdown from '../GreenDropdown.vue'
import Pill from '../Pill.vue'
import { Store, Coins, Upload, CreditCard, PiggyBank } from 'lucide-vue-next'
import Button from '../Button.vue'
import RedButton from '../RedButton.vue'
import { TransactionTypes } from '@shared/TransactionTypes'
import { Categories } from '@/enums/Categories'
import type { Account } from '@shared/Account'
import { ApiEndpoints } from '@/enums/APIEndpoints'
import { fetchWithAuth } from '@/fetchWithAuth'
import type { DropdownOption } from '@/models/DropdownOption'
import { AccountTypes } from '@shared/AccountTypes'
import { Transaction, TransactionDTO } from '@shared/Transaction'

const props = defineProps<{
  transaction: Transaction
}>()

const emit = defineEmits<{
  (e: 'updated'): void
}>()

let vendor = ref(props.transaction.vendor)
let amount = ref(parseFloat(props.transaction.amount.toString()).toFixed(2))
let account = ref<number>(props.transaction.account_id)
let type = ref(props.transaction.type)
let category = ref(props.transaction.category)
const accounts = ref<Account[]>([])

const dropDownOptions = computed<DropdownOption[]>(() => {
  return accounts.value.map((a) => ({
    label: a.name,
    value: a.id,
    icon: a.type === AccountTypes.CARD ? CreditCard : PiggyBank,
  }))
})

function onCategoryChanged(value: string) {
  category.value = value
}

async function updateTransaction() {
  if (!vendor.value || !amount.value || !type.value || !category.value || !account.value) {
    alert('Please fill in all fields.')
    return
  }

  let positiveAmount = parseFloat(amount.value.replace(/[^0-9.-]+/g, ''))

  if (type.value === TransactionTypes.EXPENSE) {
    positiveAmount = -positiveAmount
    console.log('Negative amount for expense:', positiveAmount)
  }

  const transaction: TransactionDTO = {
    vendor: vendor.value,
    accountId: Number(account.value),
    amount: positiveAmount,
    type: type.value,
    category: category.value,
  }

  await fetchWithAuth(`${ApiEndpoints.TRANSACTIONS}/${props.transaction.id}`, {
    method: 'PUT',
    body: JSON.stringify(transaction),
  })

  onClose()
}

function onClose() {
  vendor.value = ''
  amount.value = ''
  type.value = ''
  category.value = ''
  emit('updated')
}

onMounted(async () => {
  const response = await fetchWithAuth(ApiEndpoints.ACCOUNTS)
  accounts.value = await response.json()
})
</script>

<template>
  <div class="bg-black/50 fixed inset-0 z-40 flex items-center justify-center">
    <div class="absolute bg-white h-auto w-96 border-t-6 border-green-400 mx-auto z-50 p-6">
      <h1 class="text-xl text-center font-medium">Edit Transaction</h1>
      <div class="flex flex-col gap-6 mt-6">
        <div class="px-4">
          <FormLabel label="Vendor"></FormLabel>
          <GreenInput v-model="vendor">
            <Store :size="16" strokeWidth="1" />
          </GreenInput>
        </div>
        <div class="px-4">
          <FormLabel label="Account"></FormLabel>
          <GreenDropdown placeholder="Select an account" :options="dropDownOptions" v-model="account"> </GreenDropdown>
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
          <Button label="Update" class="w-full" @click="updateTransaction" />
        </div>
      </div>
    </div>
  </div>
</template>
