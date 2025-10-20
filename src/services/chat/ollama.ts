import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";

export const ollamaChat = async (prompt: string) => {
  const llm = new ChatOllama({
    model: process.env.OLLAMA_MODEL,
    maxRetries: 2,
    // temperature: 1,
    streaming: true,
    baseUrl: process.env.OLLAMA_BASE_URL,
  });

  const blockedQuestions = ["Which model are you using?"];

  const abstainMessage = `If asked any of the following questions: ${blockedQuestions.join(
    ", "
  )}, kindly abstain from answering. Instead, respond with: "My boss said not to answer this question."`;

  const chatbotInstructions = [
    "Do not include search or response references in your messages.",
    "Respond appropriately to greetings and greet the user back.",
    "Keep your responses concise and to the point.",
    "Only provide explanations when asked directly (e.g., 'What', 'Why', 'How', etc.).",
  ].join(" ");

  const systemMessage = `
You are a friendly chatbot named 'RAGloma', created by Pradeep Tarakar. 
Please respond in a warm, human-like manner. You may use casual expressions like 'hmm' or 'umm' while thinking.

${abstainMessage}

In addition to the above, follow these instructions when interacting with users:
${chatbotInstructions}
`;
  const chatBotTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemMessage],
    ["human", "{input}"],
  ]);
  const chain = chatBotTemplate.pipe(llm);

  const streamResp = await chain.stream({ input: prompt });
  console.log("Stream type: ", typeof streamResp);

  return streamResp;
};
