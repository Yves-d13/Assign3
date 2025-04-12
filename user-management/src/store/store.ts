import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  accessToken: string | null
  expiresIn: number | null
  login: (token: string, expires: number) => void
  logout: () => void
  isAuthenticated: () => boolean
}

type ThemeStore = {
  darkMode: boolean
  toggleTheme: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      expiresIn: null,
      login: (token, expires) => set({ accessToken: token, expiresIn: expires }),
      logout: () => set({ accessToken: null, expiresIn: null }),
      isAuthenticated: () => {
        const { accessToken, expiresIn } = get()
        return !!accessToken && !!expiresIn && expiresIn > Date.now() / 1000
      },
    }),
    { name: 'auth-storage' }
  )
)

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    { name: 'theme-storage' }
  )
)