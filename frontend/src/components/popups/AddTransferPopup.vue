<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import FormLabel from '../FormLabel.vue'
import GreenInput from '../GreenInput.vue'

import GreenDropdown from '../GreenDropdown.vue'
import Pill from '../Pill.vue'
import { Coins, CreditCard, PiggyBank } from 'lucide-vue-next'
import Button from '../Button.vue'
import RedButton from '../RedButton.vue'
import type { Account } from '@shared/Account'
import { ApiEndpoints } from '@/enums/APIEndpoints'
import { fetchWithAuth } from '@/fetchWithAuth'
import type { DropdownOption } from '@/models/DropdownOption'
import { AccountTypes } from '@shared/AccountTypes'
import { Transaction, TransactionDTO, TransferDTO } from '@shared/Transaction'

let props = defineProps<{
  onClose: () => void
  transaction?: Transaction
}>()

let amount = ref('')
let account = ref<number | null>(null)
let accountTo = ref<number | undefined>(undefined)

if (props.transaction) {
  amount.value = parseFloat(props.transaction.amount.toString()).toFixed(2)
  account.value = props.transaction.account_id
  accountTo.value = props.transaction.accountDestination || undefined
}

async function createTransaction() {
  if (!amount.value || !account.value || !accountTo.value) {
    alert('Please fill in all fields.')
    return
  }

  if (props.transaction) {
    await editTransaction()
    return
  }

  const transaction: TransferDTO = {
    accountId: Number(account.value),
    amount: parseFloat(amount.value.replace(/[^0-9.-]+/g, '')),
    accountDestinationId: Number(accountTo.value),
  }

  await fetchWithAuth(ApiEndpoints.TRANSFER, {
    method: 'POST',
    body: JSON.stringify(transaction),
  })

  onClose()
}

async function editTransaction() {
  if (!props.transaction) return

  const transaction: TransferDTO = {
    accountId: Number(account.value),
    amount: parseFloat(amount.value.replace(/[^0-9.-]+/g, '')),
    accountDestinationId: Number(accountTo.value),
  }

  await fetchWithAuth(`${ApiEndpoints.TRANSFER}/${props.transaction.id}`, {
    method: 'PUT',
    body: JSON.stringify(transaction),
  })

  onClose()
}

function onClose() {
  amount.value = ''
  props.onClose()
}

const accounts = ref<Account[]>([])
const dropDownOptions = computed<DropdownOption[]>(() => {
  return accounts.value.map((a) => ({
    label: a.name,
    value: a.id,
    icon: a.type === AccountTypes.CARD ? CreditCard : PiggyBank,
  }))
})

onMounted(async () => {
  const response = await fetchWithAuth(ApiEndpoints.ACCOUNTS)
  accounts.value = await response.json()
})
</script>

<template>
  <div class="bg-black/50 fixed inset-0 z-40 flex items-center justify-center">
    <div class="absolute bg-white h-auto w-96 border-t-6 border-green-400 mx-auto z-50 p-6">
      <h1 class="text-xl text-center font-medium">{{ transaction ? 'Update' : 'Add' }} Transfer</h1>
      <div class="flex flex-col gap-6 mt-6">
        <div class="px-4">
          <FormLabel label="From Account"></FormLabel>
          <GreenDropdown
            placeholder="Select an account"
            :options="dropDownOptions"
            v-model="account"
            :disable="props.transaction != null ? true : false"
          >
          </GreenDropdown>
        </div>
        <div class="px-4">
          <FormLabel label="Amount"></FormLabel>
          <GreenInput v-model="amount" type="money">
            <Coins :size="16" strokeWidth="1" />
          </GreenInput>
        </div>
        <div class="px-4">
          <FormLabel label="To Account"></FormLabel>
          <GreenDropdown
            placeholder="Select an account"
            :options="dropDownOptions"
            v-model="accountTo"
            :disable="props.transaction != null ? true : false"
          >
          </GreenDropdown>
        </div>
        <div class="flex gap-2 mt-6">
          <RedButton label="Cancel" class="w-full" @click="onClose" />
          <Button :label="transaction ? 'Update' : 'Create'" class="w-full" @click="createTransaction" />
        </div>
      </div>
    </div>
  </div>
</template>
