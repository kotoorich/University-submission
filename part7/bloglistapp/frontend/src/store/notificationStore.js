import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: null,
  type: null,
  actions: {
    showNotification: (message, type = 'success', seconds = 5) => {
      set({ message, type })
      setTimeout(() => {
        set((state) => (state.message === message ? { message: null, type: null } : {}))
      }, seconds * 1000)
    }
  }
}))

export const useNotificationMessage = () => useNotificationStore((state) => state.message)
export const useNotificationType = () => useNotificationStore((state) => state.type)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)

export default useNotificationStore
