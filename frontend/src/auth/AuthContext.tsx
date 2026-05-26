import React, { createContext, useContext, useMemo, useState } from 'react'
import type { User } from '../types'
import * as api from '../api/api'

type AuthState = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null)

const LS_KEY = 'tfs_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  })

  const value = useMemo<AuthState>(() => ({
    user,
    login: async (username, password) => {
      const u = await api.login(username, password)
      localStorage.setItem(LS_KEY, JSON.stringify(u))
      setUser(u)
    },
    logout: () => {
      localStorage.removeItem(LS_KEY)
      setUser(null)
    }
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('AuthContext missing')
  return ctx
}
