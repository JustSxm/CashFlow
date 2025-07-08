<script setup lang="ts">
import GreenInput from '@/components/GreenInput.vue'
import Button from '@/components/Button.vue'
import { KeyRound, UserRound } from 'lucide-vue-next'
import FormLabel from '@/components/FormLabel.vue'
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router'
import { ApiEndpoints } from '@/enums/APIEndpoints'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { UserDTO } from '@shared/models'

const router = useRouter()
const authStore = useAuthStore()

let username = ref('')
let password = ref('')

function goToRegister() {
  router.push({ name: RouteNames.Register })
}

async function login() {
  let userDto: UserDTO = {
    username: username.value,
    password: password.value,
  }

  var response = await fetch(ApiEndpoints.LOGIN, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userDto),
  })

  if (response.ok) {
    let data = await response.json()
    authStore.setUsername(data.username)
    authStore.setAccessToken(data.accessToken)

    router.push({ name: RouteNames.Dashboard })
  } else {
    console.error('Login failed:', response.statusText)
    alert('Login failed. Please check your credentials and try again.')
    return
  }
}

onMounted(() => {
  if (authStore.isLoggedIn()) {
    router.push({ name: RouteNames.Dashboard })
  }
})
</script>

<template>
  <div class="">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />
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
      <div class="mt-4">
        <Button label="Login" @click="login"></Button>
      </div>
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center w-full text-sm">
        Don't have an account? <a @click="goToRegister">Register</a>
      </div>
    </div>
  </div>
</template>
