import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Ollama, OllamaEmbeddings } from "@langchain/ollama";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";

export async function ragSetup() {
  const pdfPath = path.join(process.cwd(), "public/nke-10k-2023.pdf");
  const loader = new PDFLoader(pdfPath);
  const pages = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    //   addStartIndex: true,
  });

  // const allSplits = await textSplitter.splitDocuments(pages);

  // ---- Embeddings ----
  const embeddings = new OllamaEmbeddings({
    model: process.env.EMBEDDING_MODEL,
    baseUrl: process.env.OLLAMA_BASE_URL,
  });

  // ---- Vector Store ----
  const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
  await client.connect().catch((e) => console.error(e));

  const collection = client
    .db(process.env.MONGODB_ATLAS_DB_NAME)
    .collection(process.env.MONGODB_ATLAS_COLLECTION_NAME!);

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection: collection,
    indexName: "default",
    textKey: "text",
    embeddingKey: "embedding",
  });

  // --- Add docs ---
  // await vectorStore.addDocuments(allSplits).catch((e) => console.error(e));

  // Step 2: Example: Search for similar chunks
  const question = "Which products does Nike produce?";
  const retrivedDocs = await vectorStore.similaritySearch(question, 5);

  // Step 3: Feed retrived docs as context and question to llm.
  const llm = new Ollama({
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: process.env.OLLAMA_MODEL,
  });
  const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");
  const examplePrompt = await promptTemplate.invoke({
    context: retrivedDocs,
    question,
  });
  // console.log(examplePrompt)
  const llmRes = await llm.invoke(examplePrompt);
  console.log(llmRes);
}


