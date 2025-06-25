import { ApiEndpoints } from './enums/APIEndpoints'
import { useAuthStore } from './stores/authStore'
import router from './router'

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const auth = useAuthStore()

  const token = auth.accessToken

  const headers = new Headers(options.headers || {})
  headers.set('Authorization', `Bearer ${token}`)
  headers.set('Content-Type', 'application/json')

  // fetch and if fails, get new tokens with refresh token
  let response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok && response.status === 401) {
    let responseRefresh = await fetch(ApiEndpoints.REFRESH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: auth.refreshToken }),
    })

    if (responseRefresh.ok) {
      const data = await responseRefresh.json()
      auth.setAccessToken(data.access_token)
      auth.setRefreshToken(data.refresh_token)
      return await fetchWithAuth(url, options)
    } else {
      router.push('/login')
      throw new Error('Unauthorized, please log in again.')
    }
  }

  return response
}
