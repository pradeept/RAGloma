import { NextRequest, NextResponse } from "next/server";
import { createCache } from "./config/redis";
import { generateSessionId } from "./utils/sid-generator";

async function session(req: NextRequest) {
  const sessionIdFromCookie = req.cookies.get("session-id")?.value;

  if (!sessionIdFromCookie) {
    // generate a new session ID
    const newSessionId = generateSessionId();

    // set cookie via response
    const res = NextResponse.next();
    res.cookies.set("session-id", newSessionId, {
      path: "/",
      maxAge: 60 * 60, // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  }

  // If already has session ID, continue
  return NextResponse.next();
}

async function rateLimiter(req: NextRequest) {
  const sessionCookie = req.cookies.get("rate-id")?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      {
        status: 400,
        msg: "Bad request, please upload the file to send queries",
      },
      { status: 400 }
    );
  }

  const client = await createCache();
  const tokensLeft = await client.get(sessionCookie);

  if (tokensLeft) {
    await client.decr(sessionCookie);
    return NextResponse.next();
  } else {
    return NextResponse.json(
      {
        status: 400,
        msg: "Bad request, please upload the file to send queries",
      },
      { status: 400 }
    );
  }
}

export default async function middleware(req: NextRequest) {
  // check or create session first
  const sessionRes = await session(req);
  if (sessionRes && sessionRes.cookies.get("session-id")) {
    // we set a new cookie, return early to ensure it’s sent
    return sessionRes;
  }

  // only run rate limiter for specific paths
  if (req.nextUrl.pathname === "/api/doc-chat/nonefornow") {
    const rateLimitRes = await rateLimiter(req);
    return rateLimitRes;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};

/*
use upstash redis: Because middleware runs on edge runtime (nearer to user) 
hence it has no access to net and other packages which are used by redis package

Flow : 
- /api/upload will set a session id
- middleware will match /api/doc-chat and 
  rate limit the user requests.
- /api/upload should also if there is exists a session id with (key)
  that request ip. If it is there let the token exhaust and user will
  be rate limited 
- For time window we will use 6 hours. Request limit only 6 prompts in 
  in doc-chat url-chat modes
*/
