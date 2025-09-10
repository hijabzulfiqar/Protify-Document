import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { config } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    console.log("=== SUPABASE DEBUG ===");
    console.log("Admin client available:", !!supabaseAdmin);
    console.log("Bucket name:", config.upload.bucket);
    console.log(
      "Service role key exists:",
      !!process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    console.log(
      "Service role key length:",
      process.env.SUPABASE_SERVICE_ROLE_KEY?.length
    );
    console.log(
      "Service role key preview:",
      process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 50) + "..."
    );

    if (!supabaseAdmin) {
      return Response.json({
        success: false,
        error: "Supabase admin client not configured",
      });
    }

    // Test basic connection
    const { data: buckets, error: listError } =
      await supabaseAdmin.storage.listBuckets();

    if (listError) {
      console.error("List buckets error:", listError);
      return Response.json({
        success: false,
        error: "Failed to list buckets",
        details: listError,
        keyInfo: {
          exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length,
          preview:
            process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 50) + "...",
          dotCount: (process.env.SUPABASE_SERVICE_ROLE_KEY?.match(/\./g) || [])
            .length,
        },
      });
    }

    console.log(
      "Available buckets:",
      buckets?.map((b) => b.name)
    );

    // Check if our specific bucket exists
    const targetBucket = buckets?.find((b) => b.name === config.upload.bucket);

    return Response.json({
      success: true,
      buckets: buckets?.map((b) => b.name),
      targetBucket: targetBucket ? "exists" : "not found",
      bucketName: config.upload.bucket,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length,
    });
  } catch (error) {
    console.error("Supabase debug error:", error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      keyInfo: {
        exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length,
        preview:
          process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 50) + "...",
        dotCount: (process.env.SUPABASE_SERVICE_ROLE_KEY?.match(/\./g) || [])
          .length,
      },
    });
  }
}
