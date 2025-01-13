import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure S3 client with timeouts
const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  requestHandler: {
    connectionTimeout: 5000, // 5 seconds
    socketTimeout: 10000, // 10 seconds
  },
  maxAttempts: 3, // Retry up to 3 times
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Log file details for debugging
    console.log("Processing file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const buffer = await file.arrayBuffer();
    const key = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: Buffer.from(buffer),
        ContentType: file.type,
        ACL: "public-read",
      });

      await s3Client.send(command);

      // Construct the URL using the correct format for eu-north-1
      const url = `https://${process.env.AWS_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${key}`;

      // Verify the URL is accessible
      const checkResponse = await fetch(url, { method: "HEAD" });
      if (!checkResponse.ok) {
        throw new Error(`URL verification failed: ${checkResponse.status}`);
      }

      return NextResponse.json({ url });
    } catch (uploadError) {
      console.error("S3 upload details:", {
        bucket: process.env.AWS_BUCKET_NAME,
        region: "eu-north-1",
        fileSize: buffer.byteLength,
        error: uploadError,
      });
      throw uploadError;
    }
  } catch (err: unknown) {
    console.error("Upload error details:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Failed to upload file";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
