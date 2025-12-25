// Simple auth utilities for admin login

const ADMIN_EMAIL = "shubhamcsc4656@gmail.com"
const ADMIN_PASSWORD = "shubham@123321"
const AUTH_KEY = "admin_authenticated"

export function validateCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

export function setAuthenticated(value: boolean): void {
  if (typeof window !== "undefined") {
    if (value) {
      localStorage.setItem(AUTH_KEY, "true")
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem(AUTH_KEY) === "true"
  }
  return false
}

export function logout(): void {
  setAuthenticated(false)
}
