import { NextRequest } from 'next/server'
import { createUser } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { createErrorResponse, createSuccessResponse } from '@/lib/middleware'
import { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    console.log('=== REGISTRATION ATTEMPT START ===')
    
    // Log environment variables (without sensitive data)
    console.log('Environment check:')
    console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('- DIRECT_URL exists:', !!process.env.DIRECT_URL)
    console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET)
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    
    const body = await request.json()
    console.log('Request body:', { ...body, password: '[HIDDEN]' })
    
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      console.log('Validation errors:', validation.error.issues)
      return createErrorResponse(
        'Validation failed',
        400
      )
    }
    
    const { email, password, fullName } = validation.data
    console.log('Validated data:', { email, fullName, password: '[HIDDEN]' })
    
    console.log('Attempting to create user...')
    const result = await createUser(email, password, fullName)
    console.log('User creation successful!')
    
    return createSuccessResponse({
      user: result.user,
      token: result.token,
      message: 'Account created successfully'
    }, 201)
    
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return createErrorResponse('Email already exists', 409)
      }
    }
    
    console.error('Registration error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}