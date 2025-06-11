<script setup lang="ts">
import GreenInput from '@/components/GreenInput.vue'
import Button from '@/components/Button.vue'
import { KeyRound, UserRound, Asterisk } from 'lucide-vue-next'
import FormLabel from '@/components/FormLabel.vue'
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router'
import { ref, computed } from 'vue'
import { ApiEndpoints } from '@/api'

const router = useRouter()
const isLoading = ref(false)

function goToLogin() {
  router.push({ name: RouteNames.Login })
}

async function signUp() {
  if (passwordsMatch.value && password.value && confirmPassword.value && !isLoading.value && username.value) {
    isLoading.value = true

    let response = await fetch(ApiEndpoints.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })

    if (response.ok) {
      alert('Registration successful! You can now log in.')
      isLoading.value = false
      router.push({ name: RouteNames.Login })
    } else {
      console.error('Registration failed:', response.statusText)
      alert('Registration failed. Please try again.')
      isLoading.value = false
    }
  }
}

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordsMatch = computed(() => password.value === confirmPassword.value)
</script>

<template>
  <div class="">
    <img src="@/assets/logo.png" alt="Logo" class="-mt-16" />
    <div class="flex flex-col gap-6 px-14 -mt-24">
      <div>
        <FormLabel label="Username" icon=""></FormLabel>
        <GreenInput v-model="username">
          <UserRound :size="16" strokeWidth="2" />
        </GreenInput>
      </div>
      <div>
        <FormLabel label="Password" icon=""></FormLabel>
        <GreenInput type="password" v-model="password">
          <KeyRound :size="16" strokeWidth="2" />
        </GreenInput>
      </div>
      <div>
        <FormLabel label="Confirm Password" icon=""></FormLabel>
        <GreenInput type="password" v-model="confirmPassword">
          <KeyRound :size="16" strokeWidth="2" />
        </GreenInput>
        <div v-if="!passwordsMatch" class="text-red-500 text-sm bg-red-900 border border-red-500 rounded-base px-2 py-1 mt-1">
          Passwords do not match
        </div>
      </div>

      <div class="mt-4">
        <Button label="Sign Up" @click="signUp" :loading="isLoading"></Button>
      </div>
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center w-full text-sm">
        Already registered? <a @click="goToLogin">Login</a>
      </div>
    </div>
  </div>
</template>
