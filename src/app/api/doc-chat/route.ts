import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // we will get the query in formdata
  
  return NextResponse.json({msg:"You hit /api/doc-chat"});

}
