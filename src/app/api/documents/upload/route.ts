import { NextRequest } from "next/server";
import {
  authenticateRequest,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/middleware";
import { uploadFileToStorage, validateFile } from "@/lib/storage";
import { prisma } from "@/lib/prisma";
import { uploadSchema } from "@/lib/validations";
import { sanitizeFilename, sanitizeInput } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    console.log("=== FILE UPLOAD ATTEMPT ===");

    const auth = await authenticateRequest(request);
    console.log("Authentication status:", auth.authenticated);

    if (!auth.authenticated) {
      console.log("Authentication failed:", auth.error);
      return createErrorResponse(auth.error!, 401);
    }

    console.log("User authenticated:", auth.user?.email);

    const formData = await request.formData();
    console.log("Form data received");

    const file = formData.get("file") as File;
    const category = formData.get("category") as string;

    console.log("File info:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      category,
    });

    if (!file) {
      return createErrorResponse("No file provided", 400);
    }

    const categoryValidation = uploadSchema.safeParse({ category });
    if (!categoryValidation.success) {
      return createErrorResponse("Invalid category", 400);
    }

    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      return createErrorResponse(fileValidation.error!, 400);
    }

    const safeFileName = sanitizeFilename(file.name);
    const fileUrl = await uploadFileToStorage(
      file,
      safeFileName,
      auth.user!.id
    );

    const document = await prisma.document.create({
      data: {
        fileName: safeFileName,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        category: categoryValidation.data.category,
        fileUrl,
        userId: auth.user!.id,
      },
    });

    return createSuccessResponse(
      {
        document: {
          id: document.id,
          fileName: document.fileName,
          originalName: document.originalName,
          fileSize: document.fileSize,
          mimeType: document.mimeType,
          category: document.category,
          fileUrl: document.fileUrl,
          uploadedAt: document.uploadedAt,
          userId: document.userId,
        },
        message: "File uploaded successfully",
      },
      201
    );
  } catch (error) {
    console.error("=== UPLOAD ERROR ===");
    if (error instanceof Error) {
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Stack trace:", error.stack);
    }
    console.error("Full error:", error);
    return createErrorResponse("Failed to upload file", 500);
  }
}
