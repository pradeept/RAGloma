import { perplexity } from "@/lib/perplexity";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const language: string | null = request.nextUrl.searchParams.get("language");
  const input: string | null = request.nextUrl.searchParams.get("input");
  const data = await perplexity(language, input);

  if (!data) return Response.json({ error: "Invalid data" }, { status: 401 });
  console.log(data);
  return Response.json({ data }, { status: 200 });
}
