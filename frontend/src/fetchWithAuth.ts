import { ApiEndpoints } from './enums/APIEndpoints'
import { useAuthStore } from './stores/authStore'
import router, { RouteNames } from './router'

let refreshPromise: Promise<void> | null = null

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const auth = useAuthStore()

  const token = auth.accessToken

  const headers = new Headers(options.headers || {})
  headers.set('Authorization', `Bearer ${token}`)
  headers.set('Content-Type', 'application/json')

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!response.ok && response.status === 401) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshResponse = await fetch(ApiEndpoints.REFRESH, {
          method: 'POST',
          credentials: 'include',
        })

        if (!refreshResponse.ok) {
          auth.clearAuthData()
          router.push({ name: RouteNames.Login })
        }

        const data = await refreshResponse.json()
        auth.setAccessToken(data.access_token)
      })().finally(() => {
        refreshPromise = null
      })
    }
    await refreshPromise
    const newToken = auth.accessToken
    headers.set('Authorization', `Bearer ${newToken}`)

    return await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    })
  }

  return response
}
