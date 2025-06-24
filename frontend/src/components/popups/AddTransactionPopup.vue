<script setup lang="ts">
import { ref } from 'vue'
import FormLabel from '../FormLabel.vue'
import GreenInput from '../GreenInput.vue'
import Pill from '../Pill.vue'
import { Store, Coins, Upload } from 'lucide-vue-next'
import Button from '../Button.vue'
import RedButton from '../RedButton.vue'

let vendor = ref('')
let amount = ref('')
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
            <div class="bg-red-900 h-8 px-3 py-1.5 text-red-200 border-red-500 flex justify-center items-center border rounded-base w-full">
              <Upload :size="16" strokeWidth="2" class="inline-block mr-1" />
              Expense
            </div>
            <div
              class="bg-green-900 h-8 px-3 py-1.5 text-green-200 border-green-500 flex justify-center items-center border rounded-base w-full"
            >
              <Upload :size="16" strokeWidth="2" class="inline-block mr-1" />
              Income
            </div>
          </div>
        </div>
        <div class="px-4">
          <FormLabel label="Category"></FormLabel>
          <div class="flex flex-wrap gap-1">
            <Pill label="Restaurant" />
            <Pill label="Pets" />
            <Pill label="Car" />
            <Pill label="Housing" />
            <Pill label="Food" />
            <Pill label="Subscription" />
            <Pill label="Other" />
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <RedButton label="Cancel" class="w-full" />
          <Button label="Created" class="w-full" />
        </div>
      </div>
    </div>
  </div>
</template>
