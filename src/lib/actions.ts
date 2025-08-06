"use server";
import { perplexity } from "../utils/perplexity";
export async function handlePerplexity(prevState, formData) {
  const { language, input } = Object.fromEntries(formData);
  try {
    const response = perplexity(language, input);
    return { response };
  } catch (e) {
    console.log(e);
    return { error: e };
  }
}
