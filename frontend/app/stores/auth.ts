import { defineStore } from 'pinia'

interface User {
  id: number
  fullName: string | null
  email: string
}

interface AuthState {
  user: User | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    setUser(user: User | null) {
      this.user = user
    },
    logout() {
      const token = useCookie('auth_token')
      token.value = null
      this.user = null
      navigateTo('/login')
    },
  },
})
