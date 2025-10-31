"use server";
import { chatbotInstructions } from "@/utils/chatbot-instructions";
import { stm } from "@/utils/short-term-memory";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";

const llm = new ChatOllama({
  model: process.env.OLLAMA_MODEL,
  maxRetries: 2,
  // temperature: 1,
  streaming: true,
  baseUrl: process.env.OLLAMA_BASE_URL,
});

const memory = stm;

export const ollamaChat = async (sessionId: string, prompt: string) => {
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

  const streamResp = await chain.stream({ input: prompt, chat_history });

  // update prompt to store
  memory.insertNewConversation(sessionId!, new HumanMessage(prompt));

  return streamResp;
};
