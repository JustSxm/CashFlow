<script setup lang="ts">
import { ref } from 'vue'
import { AccountTypes } from '@shared/AccountTypes'
import type { Account, AccountDTO } from '@shared/Account'
import FormLabel from '../FormLabel.vue'
import GreenInput from '../GreenInput.vue'
import RedButton from '../RedButton.vue'
import Button from '../Button.vue'
import { CreditCard, Coins, PiggyBank, TriangleAlert } from 'lucide-vue-next'
import { fetchWithAuth } from '@/fetchWithAuth'
import { ApiEndpoints } from '@/enums/APIEndpoints'

let props = defineProps<{
  onClose: () => void
  account: Account
}>()

let emit = defineEmits<{
  (e: 'edited', account: Account[]): void
}>()

let accountName = ref(props.account.name)
let amount = ref(Number(props.account.balance).toFixed(2))
let type = ref(props.account.type)
let limit = ref(Number(props.account.limit).toFixed(2))

function onClose() {
  accountName.value = ''
  amount.value = '0'
  type.value = ''
  limit.value = '0'
  props.onClose()
}

async function updateAccount() {
  if (!accountName.value || !amount.value || !type.value || (type.value === AccountTypes.CARD && !limit.value)) {
    alert('Please fill in all fields.')
    return
  }

  const updatedAccount: AccountDTO = {
    accountName: accountName.value,
    amount: parseFloat(amount.value.replace(/[^0-9.-]+/g, '')),
    type: type.value,
    limit: type.value === AccountTypes.CARD ? parseFloat(limit.value.replace(/[^0-9.-]+/g, '')) : null,
  }

  let response = await fetchWithAuth(ApiEndpoints.ACCOUNT(props.account.id), {
    method: 'PUT',
    body: JSON.stringify(updatedAccount),
  })

  emit('edited', await response.json())
}
</script>

<template>
  <div class="bg-black/50 fixed inset-0 z-40 flex items-center justify-center">
    <div class="absolute bg-white h-auto w-96 border-t-6 border-green-400 mx-auto z-50 p-6">
      <h1 class="text-xl text-center font-medium">Update Account</h1>
      <div class="px-4">
        <FormLabel label="Type"></FormLabel>
        <div class="flex w-full gap-3">
          <div
            :class="[
              type == AccountTypes.CARD ? 'bg-blue-300 text-blue-100 border-blue-300' : 'bg-blue-100 text-blue-300 border-blue-300',
              ' h-8 px-3 py-1.5 flex justify-center items-center border rounded-base w-full cursor-pointer transition-colors duration-200',
            ]"
            @click="type = AccountTypes.CARD"
          >
            <CreditCard :size="16" strokeWidth="2" class="inline-block mr-1" />
            Credit Card
          </div>
          <div
            :class="[
              type == AccountTypes.CHECKING
                ? 'bg-green-200 text-green-900 border-green-200'
                : 'bg-green-900 text-green-200 border-green-500',
              ' h-8 px-3 py-1.5  flex justify-center items-center border rounded-base w-full cursor-pointer duration-200',
            ]"
            @click="type = AccountTypes.CHECKING"
          >
            <PiggyBank :size="16" strokeWidth="2" class="inline-block mr-1" />
            Checking
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-6 mt-6">
        <div class="px-4">
          <FormLabel label="Name"></FormLabel>
          <GreenInput v-model="accountName">
            <PiggyBank :size="16" strokeWidth="1" />
          </GreenInput>
        </div>
        <div class="px-4">
          <FormLabel label="Amount"></FormLabel>
          <GreenInput v-model="amount" type="money">
            <Coins :size="16" strokeWidth="1" />
          </GreenInput>
        </div>
        <div class="px-4" v-if="type === AccountTypes.CARD">
          <FormLabel label="Limit"></FormLabel>
          <GreenInput v-model="limit" type="money">
            <TriangleAlert :size="16" strokeWidth="1" />
          </GreenInput>
        </div>
        <div class="flex gap-2 mt-6">
          <RedButton label="Cancel" class="w-full" @click="onClose" />
          <Button label="Update" class="w-full" @click="updateAccount" />
        </div>
      </div>
    </div>
  </div>
</template>
