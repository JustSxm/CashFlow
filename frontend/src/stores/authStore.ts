import { defineStore } from 'pinia'
import { Stores } from './stores'
import { ref } from 'vue'

export const useAuthStore = defineStore(
  Stores.AUTH,
  () => {
    const username = ref('')
    const accessToken = ref('')
    const refreshToken = ref('')

    function setUsername(newUsername: string) {
      username.value = newUsername
    }

    function setAccessToken(newAccessToken: string) {
      accessToken.value = newAccessToken
    }

    function setRefreshToken(newRefreshToken: string) {
      refreshToken.value = newRefreshToken
    }

    function clearAuthData() {
      username.value = ''
      accessToken.value = ''
      refreshToken.value = ''
    }

    return {
      username,
      accessToken,
      refreshToken,
      setUsername,
      setAccessToken,
      setRefreshToken,
      clearAuthData,
    }
  },
  {
    persist: true,
  },
)
