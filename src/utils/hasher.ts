import crypto from "node:crypto";

export const hasher = async (file: File) => {
  // convert file instance to array buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // generate hash from buffer
  const hash = crypto.hash("sha256", buffer);
  
  return hash;
};
