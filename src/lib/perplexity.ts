import { ChatPerplexity } from "@langchain/community/chat_models/perplexity";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new ChatPerplexity({
  model: "sonar",
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
  apiKey: process.env.PERPLEXITY_API_KEY,
  // other params...
});

export async function perplexity(
  language: string | null,
  input?: string | null
) {
  if (!language || !input) {
    return false;
  }
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
  const system = "Translate the user input given in English to {language}";

  const translatorTemplate = ChatPromptTemplate.fromMessages([
    ["system", system],
    ["human", "Translate {input} to {language}"], // role is "human" in perplexity (usually it is user)
  ]);

  const chain = translatorTemplate.pipe(llm);
  const perpResponse = await chain.invoke({
    input,
    language,
  });

  // console.log(perpResponse)
  return perpResponse;
}
