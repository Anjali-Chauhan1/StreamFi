import { GridFSBucket, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getMongoDb } from "../../../../lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getMongoDb();
    const bucket = new GridFSBucket(db, { bucketName: "thumbnails" });

    const fileId = new ObjectId(params.id);
    const files = await bucket.find({ _id: fileId }).toArray();
    const file = files[0];
    if (!file) {
      return NextResponse.json({ error: "Thumbnail not found" }, { status: 404 });
    }

    const stream = bucket.openDownloadStream(fileId);
    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        "Content-Type": String(file.contentType || "image/png"),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("GET /api/thumbnails/[id] error", error);
    return NextResponse.json({ error: "Failed to fetch thumbnail" }, { status: 500 });
  }
}
