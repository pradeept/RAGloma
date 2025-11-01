"use server";
import { chatbotInstructions } from "@/utils/chatbot-instructions";
import { stm } from "@/utils/short-term-memory";
import { ChatPerplexity } from "@langchain/community/chat_models/perplexity";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const llm = new ChatPerplexity({
  model: "sonar",
  temperature: 1,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
  apiKey: process.env.PERPLEXITY_API_KEY,
});

const memory = stm;

export async function perplexity(sessionId: string, prompt: string) {
  // instructions for llm
  const instructions = chatbotInstructions();

  let chat_history: (AIMessage | HumanMessage)[] | null = null;

  chat_history = memory.getMessages(sessionId);

  // prompt template
  const chatBotTemplate = ChatPromptTemplate.fromMessages([
    ["developer", instructions],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const chain = chatBotTemplate.pipe(llm);

  // chat_history should be of BaseMessage type
  if (!chat_history) {
    chat_history = [new HumanMessage(""), new AIMessage("")];
  }

  // response streaming
  const streamResp = await chain.stream({ input:prompt, chat_history });
  
  // update prompt to store
  memory.insertNewConversation(sessionId!, new HumanMessage(prompt));

  return streamResp;
}
