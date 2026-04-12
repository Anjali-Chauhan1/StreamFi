import { NextRequest, NextResponse } from "next/server";
import { GridFSBucket } from "mongodb";
import { getMongoDb } from "../../../lib/mongodb";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = file as File;
    const mimeType = (blob.type || "").toLowerCase();
    if (!mimeType.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed for thumbnail" }, { status: 400 });
    }

    if (blob.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Thumbnail too large. Max size is 10MB" }, { status: 400 });
    }

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const db = await getMongoDb();
    const bucket = new GridFSBucket(db, { bucketName: "thumbnails" });

    const originalName = blob.name || "thumbnail";
    const ext = originalName.includes(".") ? originalName.split(".").pop() : "png";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: mimeType || "image/png",
      metadata: { originalName },
    });

    await new Promise<void>((resolve, reject) => {
      uploadStream.on("finish", () => resolve());
      uploadStream.on("error", (err) => reject(err));
      uploadStream.end(buffer);
    });

    const url = `/api/thumbnails/${uploadStream.id.toString()}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error("POST /api/upload-thumbnail error", err);
    return NextResponse.json({ error: "Failed to upload thumbnail" }, { status: 500 });
  }
}
