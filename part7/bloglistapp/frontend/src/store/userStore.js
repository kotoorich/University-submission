import { create } from 'zustand'
import loginService from '../services/login'
import blogService from '../services/blogs'
import persistentUser from '../services/persistentUser'

const initialUser = persistentUser.getUser()
if (initialUser) {
  // wire the token into the blog service immediately, before any component
  // has a chance to render and make a request
  blogService.setToken(initialUser.token)
}

const useUserStore = create((set) => ({
  user: initialUser,
  actions: {
    login: async (credentials) => {
      const user = await loginService.login(credentials)
      persistentUser.saveUser(user)
      blogService.setToken(user.token)
      set({ user })
      return user
    },
    logout: () => {
      persistentUser.removeUser()
      blogService.setToken(null)
      set({ user: null })
    }
  }
}))

export const useUser = () => useUserStore((state) => state.user)
export const useUserActions = () => useUserStore((state) => state.actions)

export default useUserStore
