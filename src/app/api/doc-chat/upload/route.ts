import { createCache } from "@/config/redis";
import { hasher } from "@/lib/hasher";
import { generateSessionId } from "@/lib/sid-generator";
import { uploadVectors } from "@/services/doc-chat/upload-vectors";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formdata = await req.formData();
  const file = formdata.get("file");

  if (!file) return new Response("No file", { status: 400 });
  if (!(file instanceof File))
    return new NextResponse("Not a file", { status: 400 });

  // get the hash of the file
  const hash = await hasher(file);

  // upload vectors
  const upload = await uploadVectors(file, hash);

  if (upload.error) {
    new Response("Failed to upload, please contact the admin", { status: 500 });
  }

  // generate an id
  const sessionId = generateSessionId();

  // set cookie
  (await cookies()).set("session-id", sessionId, {
    maxAge: 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });

  // add it to redis
  // const cache = await createCache();
  // await cache.SET(req.headers.get('ip')!,sessionId)
  // Add middleware to check the session id exists in cookie and redis
  // match this middleware with only /api/doc-chat

  return NextResponse.json(
    { msg: "File uploaded successfully", error: null },
    { status: 200 }
  );
}
