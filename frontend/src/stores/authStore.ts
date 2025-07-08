import { defineStore } from 'pinia'
import { Stores } from './stores'
import { ref } from 'vue'

export const useAuthStore = defineStore(
  Stores.AUTH,
  () => {
    const username = ref('')
    const accessToken = ref('')

    function setUsername(newUsername: string) {
      username.value = newUsername
    }

    function setAccessToken(newAccessToken: string) {
      accessToken.value = newAccessToken
    }

    function isLoggedIn() {
      return !!accessToken.value
    }

    function clearAuthData() {
      username.value = ''
      accessToken.value = ''
    }

    return {
      username,
      accessToken,
      setUsername,
      setAccessToken,
      clearAuthData,
      isLoggedIn,
    }
  },
  {
    persist: true,
  },
)
