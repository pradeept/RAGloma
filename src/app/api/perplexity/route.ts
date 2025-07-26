import { perplexity } from "@/lib/perplexity";

export async function GET(_, response) {
  const data = await perplexity();
  console.log(data);
  return Response.json({ data: data.content });
}
