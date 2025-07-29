import FormComponent from "@/components/formComponent";
import React from "react";

async function page() {
  // Complete Handler function
  const handler = async (language: string, input: string) => {
    "use server";
    console.log(language, input);
    const res = await fetch(
      `http://localhost:3000/api/perplexity?language=${language}&input=${input}`,
      {
        cache: "no-cache",
      }
    );
    const body = await res.json();
    if (body.error) return { error: body.error };
    const response = body.data.kwargs.content;
    console.log("Answer from home: ", response);
    return { response };
  };
  return (
    <div className='mx-10 my-5'>
      <FormComponent handler={handler} />
    </div>
  );
}

export default page;
