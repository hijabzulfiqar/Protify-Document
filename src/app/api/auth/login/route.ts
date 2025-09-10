import { NextRequest } from 'next/server'
import { authenticateUser } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'
import { createErrorResponse, createSuccessResponse } from '@/lib/middleware'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return createErrorResponse('Invalid email or password', 400)
    }
    
    const { email, password } = validation.data
    
    const result = await authenticateUser(email, password)
    
    return createSuccessResponse({
      user: result.user,
      token: result.token,
      message: 'Login successful'
    })
    
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return createErrorResponse('Invalid email or password', 401)
    }
    
    console.error('Login error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}