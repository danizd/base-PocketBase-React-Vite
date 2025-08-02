import { createContext, useState, useEffect } from 'react'
import { pb } from '../lib/pocketbase'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(pb.authStore.token)
  const [user, setUser] = useState(pb.authStore.model)
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setToken(token)
      setUser(model)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    setIsAuthLoading(true)
    try {
      await pb.collection('users').authWithPassword(email, password)
    } finally {
      setIsAuthLoading(false)
    }
  }

  const logout = () => {
    pb.authStore.clear()
  }

  const register = async (email, password, passwordConfirm) => {
    setIsAuthLoading(true)
    try {
      const data = {
        email,
        password,
        passwordConfirm,
      }
      await pb.collection('users').create(data)
      await login(email, password)
    } finally {
      setIsAuthLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, register, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
