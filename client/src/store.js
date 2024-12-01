import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuth = create(
  persist(
    (set, get) => ({
      user: undefined,
      setUser: (newUser) => set({ user: newUser })
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage) // (optional) by default, 'localStorage' is used
    }
  )
)

export { useAuth }
