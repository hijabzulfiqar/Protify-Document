import { useCallback } from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import { useAuth } from '@/context/AuthContext'

export function useApi() {
  const { logout } = useAuth()

  const apiCall = useCallback(async (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }

    try {
      const response = await axios(requestConfig)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 401) {
        logout()
      }
      throw error
    }
  }, [logout])

  return { apiCall }
}