import { ragSetup } from "@/services/reference";

export async function GET() {
  await ragSetup();
  return new Response("Done");
}
