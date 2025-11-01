import { ollamaChat } from "@/services/chat/ollama";
import { perplexity } from "@/services/chat/perplexity";
import { stm } from "@/utils/short-term-memory";
import { AIMessage } from "@langchain/core/messages";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const memory = stm;

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session-id")?.value; // sesion-id is set in middleware

  // setting the proper headers for SSE
  const headers = new Headers();
  headers.set("Content-Type", "text/event-stream");
  headers.set("Transfer-Encoding", "chunked");
  headers.set("Connection", "keep-alive");
  const { searchParams } = new URL(req.url);

  const prompt = searchParams.get("prompt");
  const llm = searchParams.get("llm");
  let stream;
  if (llm === "perplexity") {
    stream = await perplexity(sessionId!, prompt!);
  } else {
    stream = await ollamaChat(sessionId!, prompt!);
  }
  if (!prompt) {
    return NextResponse.json(
      { error: "Missing query parameter" },
      { status: 400 }
    );
  }

  // update ai response in store
  let aiResponse = "";

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        if (stream) {
          for await (const chunk of stream) {
            const content = chunk.content || "";
            aiResponse += content;
            // Format as SSE event
            controller.enqueue(`data: ${content}\n\n`);
          }

          memory.insertNewConversation(sessionId!, new AIMessage(aiResponse));

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
