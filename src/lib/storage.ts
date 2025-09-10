import { config } from "./config";
import { validateContentType } from "./security";
import { supabaseAdmin } from "./supabase";
import { v4 as uuidv4 } from "uuid";

export async function uploadFileToStorage(
  file: File,
  fileName: string,
  userId: string
): Promise<string> {
  console.log("=== SUPABASE STORAGE UPLOAD START ===");
  console.log("File:", fileName, "Size:", file.size, "User:", userId);

  // For now, let's use a simple approach - bypass RLS by using admin client
  // and create our own folder structure

  // Use same pattern as your client code: userId + "/" + uuid
  const filePath = `${userId}/${uuidv4()}`;

  console.log("Upload path:", filePath);

  try {
    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      throw new Error("Supabase admin client not configured");
    }

    // Convert File to ArrayBuffer for admin client
    const arrayBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage using admin client to bypass RLS
    const uploadResult = await supabaseAdmin.storage
      .from("DocumentVault")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadResult.error) {
      console.error("Supabase upload error:", uploadResult.error);
      throw new Error(`Supabase upload failed: ${uploadResult.error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("DocumentVault").getPublicUrl(filePath);

    console.log("Upload successful, public URL:", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error("=== SUPABASE STORAGE UPLOAD ERROR ===");
    console.error("Error details:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error message:", errorMessage);
    throw new Error(`Supabase storage upload failed: ${errorMessage}`);
  }
}

export async function deleteFileFromStorage(fileUrl: string): Promise<void> {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not configured");
  }

  try {
    // Extract file path from URL
    const url = new URL(fileUrl);
    const pathSegments = url.pathname.split("/");
    // For Supabase URLs, the path structure is: /storage/v1/object/public/DocumentVault/userId/fileId
    const filePath = pathSegments.slice(-2).join("/"); // userId/fileId

    console.log("Deleting file:", filePath, "from DocumentVault bucket");

    const { error } = await supabaseAdmin.storage
      .from("DocumentVault")
      .remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error(`Supabase delete failed: ${error.message}`);
    }

    console.log("File deleted successfully");
  } catch (error) {
    console.error("Supabase storage delete error:", error);
    throw new Error("Failed to delete file from Supabase storage");
  }
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > config.upload.maxFileSize) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(
        config.upload.maxFileSize / 1024 / 1024
      )}MB`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: "File is empty",
    };
  }

  if (!validateContentType(file, config.upload.allowedTypes)) {
    return {
      valid: false,
      error: `File type not supported. Allowed types: ${config.upload.allowedTypes.join(
        ", "
      )}`,
    };
  }

  if (file.name.length > 255) {
    return {
      valid: false,
      error: "Filename is too long",
    };
  }

  return { valid: true };
}
