import { NextRequest } from 'next/server'
import { getTokenFromHeader, verifyJWT } from './jwt'
import { getUserFromToken } from './auth'

export async function authenticateRequest(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  const token = getTokenFromHeader(authorization || '')
  
  if (!token) {
    return { authenticated: false, error: 'No token provided' }
  }
  
  const payload = verifyJWT(token)
  if (!payload) {
    return { authenticated: false, error: 'Invalid token' }
  }
  
  const user = await getUserFromToken(token)
  if (!user) {
    return { authenticated: false, error: 'User not found' }
  }
  
  return { authenticated: true, user, token }
}

export function createErrorResponse(message: string, status: number = 400) {
  return Response.json(
    { success: false, message },
    { status }
  )
}

export function createSuccessResponse(data: any, status: number = 200) {
  return Response.json(
    { success: true, ...data },
    { status }
  )
}