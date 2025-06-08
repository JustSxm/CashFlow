<script setup lang="ts">
import FormLabel from '@/components/FormLabel.vue'
import GreenInput from '@/components/GreenInput.vue'
import Button from '@/components/Button.vue'
import { KeyRound, User, UserRound } from 'lucide-vue-next'
</script>

<template>
  <div class="">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />
    <div class="flex flex-col gap-6 px-14 -mt-24">
      <div>
        <FormLabel label="Username" icon=""></FormLabel>
        <GreenInput>
          <UserRound :size="16" strokeWidth="2" />
        </GreenInput>
      </div>
      <div>
        <FormLabel label="Password" icon=""></FormLabel>
        <GreenInput type="password">
          <KeyRound :size="16" strokeWidth="2" />
        </GreenInput>
      </div>
      <div class="mt-4">
        <Button label="Login" classes="elevation-1"></Button>
      </div>
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center w-full text-sm">
        Don't have an account? <span class="text-green-500">Register</span>
      </div>
    </div>
  </div>
</template>
