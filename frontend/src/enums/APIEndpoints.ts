let api = `${window.location.protocol}//${window.location.hostname}`
if (import.meta.env.VITE_API_PORT) {
  api += `:${import.meta.env.VITE_API_PORT}`
} else {
  api += '/api'
}

export const ApiEndpoints = {
  LOGIN: `${api}/auth/login`,
  REGISTER: `${api}/auth/register`,
  REFRESH: `${api}/auth/refresh`,
  ACCOUNTS: `${api}/me/accounts`,
  ACCOUNT: (id: number) => `${api}/me/accounts/${id}`,
  TRANSACTIONS: `${api}/me/transactions`,
  SETTINGS: `${api}/me/settings`,
  TRANSFER: `${api}/me/transfer`,
  TRANSFER_UPDATE: (id: number) => `${api}/me/transfer/${id}`,
} as const
