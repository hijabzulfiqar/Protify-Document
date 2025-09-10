import { DocumentCategory } from '@/lib/config'

export interface User {
  id: string
  email: string
  fullName: string
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  fileName: string
  originalName: string
  fileSize: number
  mimeType: string
  category: DocumentCategory
  fileUrl: string
  uploadedAt: Date
  userId: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

export interface UploadResponse {
  success: boolean
  document?: Document
  message?: string
}

export interface APIError {
  success: false
  message: string
  errors?: Record<string, string[]>
}