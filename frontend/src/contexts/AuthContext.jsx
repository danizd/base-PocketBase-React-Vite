import { createContext, useState, useEffect } from 'react'
import { pb } from '../lib/pocketbase'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(pb.authStore.token)
  const [user, setUser] = useState(pb.authStore.model)

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
    try {
      const authData = await pb.collection('users').authWithPassword(email, password)
      setToken(pb.authStore.token)
      setUser(pb.authStore.model)
      return { authData, error: null }
    } catch (error) {
      return { authData: null, error }
    }
  }

  const logout = () => {
    pb.authStore.clear()
    setToken(null)
    setUser(null)
  }

  const register = async (email, password, passwordConfirm) => {
    try {
      const data = {
        email,
        password,
        passwordConfirm,
      }
      await pb.collection('users').create(data)
      await login(email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
