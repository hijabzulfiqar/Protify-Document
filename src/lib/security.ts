import { NextRequest } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    
    setInterval(() => this.cleanup(), this.windowMs)
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const entry = this.store.get(identifier)

    if (!entry || now > entry.resetTime) {
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return false
    }

    if (entry.count >= this.maxRequests) {
      return true
    }

    entry.count++
    return false
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

export const globalRateLimit = new RateLimiter(1000, 15 * 60 * 1000)
export const authRateLimit = new RateLimiter(50, 15 * 60 * 1000) // Increased for development
export const uploadRateLimit = new RateLimiter(100, 60 * 1000)

export function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown'
  return ip
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, '_$1')
    .replace(/^\.+/, '')
    .substring(0, 255)
}

export function validateContentType(file: File, allowedTypes: string[]): boolean {
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  if (!fileExtension) return false
  
  return allowedTypes.includes(fileExtension)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>'"]/g, '')
    .substring(0, 1000)
}

export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'"
}