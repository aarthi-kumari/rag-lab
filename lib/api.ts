export const api = "http://localhost:4000"

const tokenKey = "token"

export function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem(tokenKey)
}

export function saveToken(token: string) {
  localStorage.setItem(tokenKey, token)
}

export function clearToken() {
  localStorage.removeItem(tokenKey)
}

export function authHeaders(extra?: Record<string, string>) {
  const token = getToken()
  return {
    ...(extra ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}
