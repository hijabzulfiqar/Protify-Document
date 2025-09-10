import { NextRequest } from 'next/server'
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '@/lib/middleware'
import { deleteFileFromStorage } from '@/lib/storage'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    
    if (!auth.authenticated) {
      return createErrorResponse(auth.error!, 401)
    }
    
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')
    
    if (!documentId) {
      return createErrorResponse('Document ID is required', 400)
    }
    
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: auth.user!.id
      }
    })
    
    if (!document) {
      return createErrorResponse('Document not found', 404)
    }
    
    try {
      await deleteFileFromStorage(document.fileUrl)
    } catch (storageError) {
      console.warn('Failed to delete from storage:', storageError)
    }
    
    await prisma.document.delete({
      where: { id: documentId }
    })
    
    return createSuccessResponse({
      message: 'Document deleted successfully'
    })
    
  } catch (error) {
    console.error('Delete document error:', error)
    return createErrorResponse('Failed to delete document', 500)
  }
}