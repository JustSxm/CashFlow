<script setup lang="ts">
import AccountCard from '@/components/AccountCard.vue'
import Button from '@/components/Button.vue'
import AddAccountPopup from '@/components/popups/AddAccountPopup.vue'
import { ApiEndpoints } from '@/enums/APIEndpoints'
import { fetchWithAuth } from '@/fetchWithAuth'
import { LoaderCircle } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { Account } from '@shared/Account'
import { RouteNames } from '@/router'
import BackButton from '@/components/BackButton.vue'

let showAddTransactionPopup = ref(false)
let loading = ref(true)
let data = ref<Account[] | null>(null)

function close() {
  showAddTransactionPopup.value = false
}

onMounted(async () => {
  try {
    const response = await fetchWithAuth(ApiEndpoints.ACCOUNTS)

    data.value = await response.json()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AddAccountPopup v-if="showAddTransactionPopup" :onClose="close" />
  <div class="py-2 px-4">
    <BackButton :link="RouteNames.Dashboard" />
  </div>
  <div v-if="loading" class="flex items-center justify-center h-screen">
    <LoaderCircle class="w-12 h-12 text-green-500 animate-spin" />
  </div>
  <div class="pt-4 px-2 flex flex-col gap-4 pb-20" v-else>
    <div v-for="account in data" class="flex flex-col gap-4">
      <AccountCard :account="account" />
    </div>
    <div class="fixed bottom-0 flex w-full p-4 gap-3">
      <Button label="Add Account" class="flex-1 shadow-lg" @click="showAddTransactionPopup = true" />
    </div>
  </div>
</template>
