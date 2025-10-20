import { ChatPerplexity } from "@langchain/community/chat_models/perplexity";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new ChatPerplexity({
  model: "sonar",
  temperature: 1,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
  apiKey: process.env.PERPLEXITY_API_KEY,
});

export async function perplexity(prompt: string) {
  // SIMPLE PROMPT INVOCATION

  // const aiMsg = await llm.invoke([
  //   {
  //     role: "system",
  //     content:
  //       "You are a helpful assistant that translates English to French. Translate the user sentence.",
  //   },
  //   {
  //     role: "user",
  //     content: "I love programming.",
  //   },
  // ]);
  // return aiMsg;

  // PROMPT TEMPLATE
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
    ["human", prompt],
  ]);

  const chain = chatBotTemplate.pipe(llm);
  // const perpResponse = await chain.invoke({
  //   input,
  //   language,
  // });

  const streamResp = await chain.stream({ prompt });
  console.log("Stream type: ", typeof streamResp);

  return streamResp;
}
