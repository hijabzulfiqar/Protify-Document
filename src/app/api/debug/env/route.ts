import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
    DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 30) + '...',
    DIRECT_URL_EXISTS: !!process.env.DIRECT_URL,
    DIRECT_URL_PREFIX: process.env.DIRECT_URL?.substring(0, 30) + '...',
    JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
    SUPABASE_URL_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY_EXISTS: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  }
  
  console.log('Environment Variables Check:', envCheck)
  
  return Response.json({
    success: true,
    environment: envCheck,
    timestamp: new Date().toISOString()
  })
}