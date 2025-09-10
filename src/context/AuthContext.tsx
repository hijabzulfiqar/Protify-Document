'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { User, AuthResponse } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (email: string, password: string, fullName: string) => Promise<AuthResponse>
  logout: () => void
  isAuthenticated: boolean
  isLoggingOut: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialCheckDone, setInitialCheckDone] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { user, token } = response.data

      localStorage.setItem('token', token)
      setUser(user)

      return { success: true, user, token }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      return { success: false, message }
    }
  }

  const register = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<AuthResponse> => {
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        fullName
      })
      const { user, token } = response.data

      localStorage.setItem('token', token)
      setUser(user)

      return { success: true, user, token }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      return { success: false, message }
    }
  }

  const logout = () => {
    setIsLoggingOut(true)
    localStorage.removeItem('token')
    setUser(null)
    setInitialCheckDone(true)
    setLoading(false)
    // Reset logout flag after a short delay
    setTimeout(() => setIsLoggingOut(false), 100)
  }

  const verifyToken = async () => {
    if (initialCheckDone) {
      setLoading(false)
      return
    }

    const token = localStorage.getItem('token')
    
    if (!token) {
      setLoading(false)
      setInitialCheckDone(true)
      return
    }

    try {
      const response = await axios.get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
      setInitialCheckDone(true)
    }
  }

  useEffect(() => {
    verifyToken()
  }, [])

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isLoggingOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}