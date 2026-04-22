import { defineStore } from 'pinia'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const TOKEN_KEY = 'gamehub_token'

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.')
  }

  return data
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || '',
    user: null,
    loading: false,
    error: '',
  }),
  getters: {
    isAuthenticated: state => Boolean(state.token),
  },
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = ''

      try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
          body: JSON.stringify(credentials),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })
        const data = await parseResponse(response)

        this.token = data.token || data.accessToken || ''
        localStorage.setItem(TOKEN_KEY, this.token)
        this.user = data.user || null

        // if (!this.user && this.token) {
        //   await this.fetchProfile()
        // }
      } catch (error) {
        this.logout()
        this.error = error.message || 'Unable to login.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async fetchProfile() {
      if (!this.token) {
        return null
      }

      this.loading = true
      this.error = ''

      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        const data = await parseResponse(response)

        this.user = data.user || data.profile || data
        return this.user
      } catch (error) {
        this.error = error.message || 'Unable to fetch profile.'
        if (error.message?.toLowerCase().includes('unauthorized')) {
          this.logout()
        }
        throw error
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.token = ''
      this.user = null
      this.error = ''
      localStorage.removeItem(TOKEN_KEY)
    },
  },
})
