import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse, createErrorResponse } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Try to query the database
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    await prisma.$disconnect()
    
    return createSuccessResponse({
      message: 'Database connection successful!',
      result
    })
    
  } catch (error) {
    console.error('Database connection error:', error)
    return createErrorResponse(`Database connection failed: ${error}`, 500)
  }
}