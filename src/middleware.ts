import { NextRequest, NextResponse } from "next/server";
import { createCache } from "./config/redis";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({
      status: 400,
      msg: "Bad request, please upload the file to send queries",
    });
  } else {
    // get key from cache
    const client = await createCache();
    const tokensLeft = await client.get(sessionCookie);

    if (tokensLeft) {
      await client.decr(sessionCookie);
      return NextResponse.next();
    } else {
      return NextResponse.json({
        status: 400,
        msg: "Bad request, please upload the file to send queries",
      });
    }
  }
}

export const config = {
  matcher: "/api/doc-chat/nonefornow",
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
