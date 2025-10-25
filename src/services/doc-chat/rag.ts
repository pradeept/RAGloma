import { createIndex } from "@/lib/vector-store";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/ollama";
import { pull } from "langchain/hub";

export async function chatWithDoc(query: string) {
  const index = await createIndex();
  // search the dense index
  const results = await index.searchRecords({
    query: {
      topK: 5,
      inputs: { text: query },
    },
  });

  // create llm instance
  const llm = new Ollama({
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: process.env.OLLAMA_MODEL,
  });

  // use rag-template pulled from langchain hub
  const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");

  const contextString = results.result.hits
    .map((hit) => hit.fields.chunk_text)
    .join(",")
    .toString();
  // prepare prompt
  const prompt = await promptTemplate.invoke({
    context: [results.result.hits],
    question: contextString,
  });

  // invoke on specified llm
  const llmRes = await llm.stream(prompt);
  return llmRes;
}
