import { GridFSBucket, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { Readable } from "node:stream";
import { getMongoDb } from "../../../../lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid media id" }, { status: 400 });
    }

    const db = await getMongoDb();
    const bucket = new GridFSBucket(db, { bucketName: "media" });

    const fileId = new ObjectId(params.id);
    const files = await bucket.find({ _id: fileId }).toArray();
    const file = files[0];
    if (!file) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const totalLength = Number(file.length || 0);
    const rangeHeader = req.headers.get("range");

    if (rangeHeader && totalLength > 0) {
      const bytesPrefix = "bytes=";
      if (!rangeHeader.startsWith(bytesPrefix)) {
        return NextResponse.json({ error: "Invalid range header" }, { status: 416 });
      }

      const [startRaw, endRaw] = rangeHeader.slice(bytesPrefix.length).split("-");
      const start = Number(startRaw);
      const end = endRaw ? Number(endRaw) : totalLength - 1;

      if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < start || end >= totalLength) {
        return NextResponse.json({ error: "Range not satisfiable" }, { status: 416 });
      }

      const chunkLength = end - start + 1;
      const stream = bucket.openDownloadStream(fileId, { start, end: end + 1 });

      return new NextResponse(Readable.toWeb(stream as any) as ReadableStream, {
        status: 206,
        headers: {
          "Content-Type": String(file.contentType || "application/octet-stream"),
          "Content-Length": String(chunkLength),
          "Content-Range": `bytes ${start}-${end}/${totalLength}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const stream = bucket.openDownloadStream(fileId);
    return new NextResponse(Readable.toWeb(stream as any) as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": String(file.contentType || "application/octet-stream"),
        "Content-Length": String(totalLength),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("GET /api/media/[id] error", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
