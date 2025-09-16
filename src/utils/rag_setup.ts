import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OllamaEmbeddings } from "@langchain/ollama";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";

export async function ragSetup() {
  const pdfPath = path.join(process.cwd(), "public/nke-10k-2023.pdf");
  const loader = new PDFLoader(pdfPath);
  const pages = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    //   addStartIndex: true,
  });

  const allSplits = await textSplitter.splitDocuments(pages);

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
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding",
  });

  // --- Add docs ---
  await vectorStore.addDocuments(allSplits).catch((e) => console.error(e));

  // Step 2: Example: Search for similar chunks
  const query = "What was Nike's revenue in 2023?";
  const results = await vectorStore.similaritySearch(query, 5);

  results.forEach((doc, i) => {
    console.log(`Result ${i + 1}:`);
    console.log(doc.pageContent);
  });
  // console.log(allSplits[1].metadata);
}

/*
Error

[TypeError: fetch failed] {
  [cause]: [Error [HeadersTimeoutError]: Headers Timeout Error] {
    code: 'UND_ERR_HEADERS_TIMEOUT'
  }
}
 ⨯ unhandledRejection: [TypeError: fetch failed] {
  [cause]: [Error [HeadersTimeoutError]: Headers Timeout Error] {
    code: 'UND_ERR_HEADERS_TIMEOUT'
  }
}
 ⨯ unhandledRejection:  [TypeError: fetch failed] {
  [cause]: [Error [HeadersTimeoutError]: Headers Timeout Error] {
    code: 'UND_ERR_HEADERS_TIMEOUT'
  }
}
[TypeError: fetch failed] {
  [cause]: [Error [HeadersTimeoutError]: Headers Timeout Error] {
    code: 'UND_ERR_HEADERS_TIMEOUT'
  }
}
*/
