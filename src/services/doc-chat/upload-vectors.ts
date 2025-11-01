import { createIndex } from "@/lib/vector-store";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const uploadVectors = async (
  file: File,
  hash: string
): Promise<{ success: boolean; error: null | string }> => {
  // load the pdf
  const loader = new PDFLoader(file);
  const pages = await loader.load();
  console.log("Loaded document's hash: ", hash);

  // split text into overlapping chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const records = await textSplitter.splitDocuments(pages);

  // add metadata and format it according to pinecone
  const recordsWithMetadata = records.map((chunk, index) => {
    return {
      chunk_text: chunk.pageContent, //key should match fieldmap in index
      id: `${hash}-chunk-${index}`, // important to avoid storing same vectors again
      fileHash: hash,
    };
  });

  // creat the index
  const index = await createIndex(hash);
  if (!index) {
    return { success: false, error: "Failed to create index" };
  }
  // upsert the chunks
  /*
    Embedding: taken care by pinecone.
    Redundancy: vectors with same id are skipped. We
    are assigning id as filehash-chunk-index.
  */
  try {
    await index.upsertRecords(recordsWithMetadata);
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to upload vectors" };
  }

  // wait for 2 seconds
  const sleep = new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
  await sleep;

  return { success: true, error: null };
};

export { uploadVectors };
