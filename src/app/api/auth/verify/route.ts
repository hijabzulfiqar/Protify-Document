import { NextRequest } from 'next/server'
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    
    if (!auth.authenticated) {
      return createErrorResponse(auth.error!, 401)
    }
    
    return createSuccessResponse({
      user: auth.user,
      message: 'Token valid'
    })
    
  } catch (error) {
    console.error('Token verification error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}