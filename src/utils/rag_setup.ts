import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

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

  console.log(allSplits[1]);
}
