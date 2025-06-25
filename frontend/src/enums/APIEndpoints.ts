const api = import.meta.env.VITE_API_BASE_URL
export const ApiEndpoints = {
  LOGIN: `${api}/auth/login`,
  REGISTER: `${api}/auth/register`,
  REFRESH: `${api}/auth/refresh`,
} as const
