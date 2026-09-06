import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: null,
  actions: {
    showNotification: (message, seconds = 5) => {
      set({ message })
      setTimeout(() => {
        set((state) => (state.message === message ? { message: null } : {}))
      }, seconds * 1000)
    }
  }
}))

export const useNotificationMessage = () => useNotificationStore((state) => state.message)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)

export default useNotificationStore
