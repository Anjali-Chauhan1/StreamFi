import { GridFSBucket, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { Readable } from "node:stream";
import { getMongoDb } from "../../../../lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid thumbnail id" }, { status: 400 });
    }

    const db = await getMongoDb();
    const bucket = new GridFSBucket(db, { bucketName: "thumbnails" });

    const fileId = new ObjectId(params.id);
    const files = await bucket.find({ _id: fileId }).toArray();
    const file = files[0];
    if (!file) {
      return NextResponse.json({ error: "Thumbnail not found" }, { status: 404 });
    }

    const stream = bucket.openDownloadStream(fileId);
    return new NextResponse(Readable.toWeb(stream as any) as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": String(file.contentType || "image/png"),
        "Content-Length": String(Number(file.length || 0)),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("GET /api/thumbnails/[id] error", error);
    return NextResponse.json({ error: "Failed to fetch thumbnail" }, { status: 500 });
  }
}
