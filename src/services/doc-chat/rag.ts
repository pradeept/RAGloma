import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/ollama";
import { pull } from "langchain/hub";

export async function chatWithDoc() {
  
  // example query
  const query = "Explain business activity";

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

  // prepare prompt
  const prompt = await promptTemplate.invoke({
    context: [results.result.hits],
    question: query,
  });

  // invoke on specified llm
  const llmRes = await llm.invoke(prompt);

  // log the response for now
  console.log(llmRes);
}
