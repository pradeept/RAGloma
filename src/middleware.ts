import { createCache } from "@/config/redis";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const userIp = req.headers.get("ip");
  console.log(userIp);
  console.log("Reached");
  const key = null;
  // const cache = await createCache();
  // const key = await cache.GET(userIp!);
  if (key) {
    return NextResponse.next();
  } else {
    return NextResponse.json({ status: 400, msg: "Bad request" });
  }
};

export const config = {
  matcher: "/api/doc-chat",
};
