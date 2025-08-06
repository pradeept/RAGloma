import { ChatPerplexity } from "@langchain/community/chat_models/perplexity";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new ChatPerplexity({
  model: "sonar",
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
  apiKey: process.env.PERPLEXITY_API_KEY,
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
  const template1 = 'The translation of "{input}" into {language} is:';
  const template2 = "Here is the translation of your input into {language}:";

  const system = `Translate the user's input from English to {language}. If the {input} contains fewer than 10 words, begin your response with: ${template1} Otherwise, start with: ${template2} Do not include any details or references.`;

  const translatorTemplate = ChatPromptTemplate.fromMessages([
    ["system", system],
    ["human", "Translate {input} into {language}"],
  ]);

  const chain = translatorTemplate.pipe(llm);
  // const perpResponse = await chain.invoke({
  //   input,
  //   language,
  // });

  const streamResp = await chain.stream({ input, language });
  console.log("Stream type: ", typeof streamResp);

  return streamResp;
}
