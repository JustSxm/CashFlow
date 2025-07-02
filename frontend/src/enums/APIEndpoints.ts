const api = import.meta.env.VITE_API_BASE_URL
export const ApiEndpoints = {
  LOGIN: `${api}/auth/login`,
  REGISTER: `${api}/auth/register`,
  REFRESH: `${api}/auth/refresh`,
  ACCOUNTS: `${api}/me/accounts`,
  TRANSACTIONS: `${api}/me/transactions`,
  SETTINGS: `${api}/me/settings`,
  TRANSFER: `${api}/me/transfer`,
} as const
