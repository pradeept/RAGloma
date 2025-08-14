import { ragSetup } from "@/utils/rag_setup";

export async function GET() {
  await ragSetup();
  return new Response("Done");
}
