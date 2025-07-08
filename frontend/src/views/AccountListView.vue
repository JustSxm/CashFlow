<script setup lang="ts">
import AccountCard from '@/components/AccountCard.vue'
import Button from '@/components/Button.vue'
import AddAccountPopup from '@/components/popups/AddAccountPopup.vue'
import EditAccountPopup from '@/components/popups/EditAccountPopup.vue'
import { ApiEndpoints } from '@/enums/APIEndpoints'
import { fetchWithAuth } from '@/fetchWithAuth'
import { LoaderCircle } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { Account } from '@shared/Account'
import { RouteNames } from '@/router'
import BackButton from '@/components/BackButton.vue'

let showAddTransactionPopup = ref(false)
let showEditTransactionPopup = ref(false)
let accountInEdit = ref<Account | null>(null)
let loading = ref(true)
let data = ref<Account[]>([])

function close() {
  showAddTransactionPopup.value = false
  showEditTransactionPopup.value = false
  accountInEdit.value = null
}

async function fetchAccounts() {
  const response = await fetchWithAuth(ApiEndpoints.ACCOUNTS)
  data.value = await response.json()
}

async function onEditAccount(account: Account) {
  accountInEdit.value = account
  showEditTransactionPopup.value = true
}

async function onEditCompleted(accounts: Account[]) {
  data.value = accounts
  close()
}

async function onDeleteAccount(account: Account) {
  await fetchWithAuth(ApiEndpoints.ACCOUNT(account.id), {
    method: 'DELETE',
  })

  data.value = data.value.filter((a) => a.id !== account.id)
}

onMounted(async () => {
  try {
    await fetchAccounts()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AddAccountPopup v-if="showAddTransactionPopup" :onClose="close" @created="fetchAccounts" />
  <EditAccountPopup v-if="showEditTransactionPopup" :onClose="close" :account="accountInEdit!" @edited="onEditCompleted"></EditAccountPopup>
  <div class="py-2 px-4">
    <BackButton :link="RouteNames.Settings" />
  </div>
  <div v-if="loading" class="flex items-center justify-center h-screen">
    <LoaderCircle class="w-12 h-12 text-green-500 animate-spin" />
  </div>
  <div class="pt-4 px-2 flex flex-col gap-4 pb-20" v-else>
    <div v-for="account in data" class="flex flex-col gap-4">
      <AccountCard :account="account" @edit="onEditAccount" @delete="onDeleteAccount" />
    </div>
    <div class="fixed bottom-0 flex w-full p-4 gap-3">
      <Button label="Add Account" class="flex-1 shadow-lg" @click="showAddTransactionPopup = true" />
    </div>
  </div>
</template>
