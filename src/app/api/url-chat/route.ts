import { ragSetup } from "@/utils/rag";

export async function GET() {
  await ragSetup();
  return new Response("Done");
}
