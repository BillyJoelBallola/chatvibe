import { defineStore } from 'pinia'

type UserStoreState = {
  user: any
}

type UserStoreActionsType = {
  setUser: (value: any) => void
  removeUser: () => void
}

const useUserStore = defineStore<'user', UserStoreState, {}, UserStoreActionsType>('user', {
  state: () => ({ user: null }),
  getters: {},
  actions: {
    setUser(value: any) {
      this.user = value
    },
    removeUser() {
      this.user = null
    },
  },
  persist: true,
})

export { useUserStore }
