import { NextResponse } from "next/server";

export async function POST() {
  // get the query in formdata
  
  return NextResponse.json({msg:"You hit /api/doc-chat"});

}
