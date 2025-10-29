import { createCache } from "@/config/redis";
import { hasher } from "@/utils/hasher";
import { generateSessionId } from "@/utils/sid-generator";
import { uploadVectors } from "@/services/doc-chat/upload-vectors";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formdata = await req.formData();
  const file = formdata.get("file");

  if (!file) {
    return NextResponse.json({ msg: "No file", error: true }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { msg: "Not a file", error: null },
      { status: 400 }
    );
  }

  // Generate file hash
  const hash = await hasher(file);

  // Upload vectors
  const upload = await uploadVectors(file, hash);

  if (upload.error) {
    return NextResponse.json(
      { msg: "Failed to upload, please contact the admin", error: true },
      {
        status: 500,
      }
    );
  }

  const client = await createCache();
  const cookieStore = await cookies();

  const sessionIdFromCookie = cookieStore.get("session-id")?.value;

  if (!sessionIdFromCookie || !(await client.get(sessionIdFromCookie))) {
    // generate a new session ID
    const newSessionId = generateSessionId();

    // store session in Redis for 6 hours
    await client.set(newSessionId, 6, { ex: 60 * 60 * 6 });

    // set cookie via response
    const response = NextResponse.json(
      { msg: "File uploaded successfully", error: null },
      { status: 200 }
    );

    response.cookies.set("session-id", newSessionId, {
      maxAge: 60 * 60 * 6,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  }

  return NextResponse.json(
    { msg: "File uploaded successfully", error: null },
    { status: 200 }
  );
}
