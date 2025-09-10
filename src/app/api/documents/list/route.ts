import { NextRequest } from 'next/server'
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '@/lib/middleware'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    
    if (!auth.authenticated) {
      return createErrorResponse(auth.error!, 401)
    }
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const where: any = { userId: auth.user!.id }
    if (category) {
      where.category = category
    }
    
    const documents = await prisma.document.findMany({
      where,
      orderBy: {
        uploadedAt: 'desc'
      }
    })
    
    return createSuccessResponse({
      documents: documents.map(doc => ({
        id: doc.id,
        fileName: doc.fileName,
        originalName: doc.originalName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        category: doc.category,
        fileUrl: doc.fileUrl,
        uploadedAt: doc.uploadedAt,
        userId: doc.userId
      }))
    })
    
  } catch (error) {
    console.error('List documents error:', error)
    return createErrorResponse('Failed to fetch documents', 500)
  }
}