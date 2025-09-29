import { perplexity } from "@/utils/perplexity";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Setting the proper headers for SSE
  const headers = new Headers();
  headers.set("Content-Type", "text/event-stream");
  headers.set("Transfer-Encoding", "chunked");
  headers.set("Connection", "keep-alive");
  const { searchParams } = new URL(req.url);

  const prompt = searchParams.get("prompt");
  const stream = await perplexity(prompt!);

  if (!prompt) {
    return NextResponse.json(
      { error: "Missing query parameter" },
      { status: 400 }
    );
  }

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        if (stream) {
          for await (const chunk of stream) {
            const content = chunk.content || "";
            // Format as SSE event
            controller.enqueue(`data: ${content}\n\n`);
          }
          controller.enqueue("event: end\ndata: \n\n");
          controller.close();
        }
      } catch (err) {
        controller.error(err);
      }
    },
  });

  // Return the response with the stream
  return new Response(readableStream, { headers });
}
