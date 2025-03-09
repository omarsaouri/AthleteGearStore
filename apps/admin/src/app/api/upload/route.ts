import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // First, create the bucket if it doesn't exist
    try {
      const { error: createBucketError } = await supabase.storage.createBucket(
        "products",
        {
          public: true,
          fileSizeLimit: 52428800, // 50MB
        }
      );

      if (
        createBucketError &&
        createBucketError.message !== "Bucket already exists"
      ) {
        console.error("Error creating bucket:", createBucketError);
        throw createBucketError;
      }
    } catch (bucketError) {
      console.log("Bucket creation attempted:", bucketError);
      // Continue if bucket already exists
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    console.log("Successfully uploaded file:", publicUrl);

    return NextResponse.json({ url: publicUrl.publicUrl });
  } catch (err: unknown) {
    console.error("Upload error details:", err);
    let errorMessage = "Failed to upload file";

    if (err instanceof Error) {
      errorMessage = `Upload failed: ${err.message}`;
      console.error("Error stack:", err.stack);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
