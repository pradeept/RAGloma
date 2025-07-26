import { ChatPerplexity } from "@langchain/community/chat_models/perplexity";

const llm = new ChatPerplexity({
  model: "sonar",
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
  apiKey: process.env.PERPLEXITY_API_KEY,
  // other params...
});
export async function perplexity() {
  const aiMsg = await llm.invoke([
    {
      role: "system",
      content:
        "You are a helpful assistant that translates English to French. Translate the user sentence.",
    },
    {
      role: "user",
      content: "I love programming.",
    },
  ]);
  return aiMsg;
}
