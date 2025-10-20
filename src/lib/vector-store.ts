import { Pinecone, } from "@pinecone-database/pinecone";

const createIndex = async ()=>{
  // create a pine client
  const pineClient = new Pinecone({ apiKey: process.env.PINECONE_KEY || "" });

  const indexName = "ragloma";

  try {
    // fetch the index list
    const indexes = await pineClient.listIndexes();
    console.log("Indexes: ", indexes);

    // check if indexName already exists
    const indexExists = indexes.indexes?.some(
      (index) => index.name === indexName
    );

    if (!indexExists) {
      await pineClient.createIndexForModel({
        name: indexName,
        cloud: "aws",
        region: "us-east-1",
        embed: {
          model: "llama-text-embed-v2",
          fieldMap: { text: "chunk_text" },
        },
        waitUntilReady: true,
      });
      console.log(`Index "${indexName}" created.`);
    } else {
      console.log(`Index "${indexName}" already exists.`);
    }
  } catch (error) {
    console.error("Error checking or creating index:", error);
  }
  // create a reference for index
  const index = pineClient.index(indexName).namespace("default-namespace");
  return index;
}

// export for upserting
export { createIndex };
