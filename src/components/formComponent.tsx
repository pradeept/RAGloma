"use client";
import React, { useState } from "react";

function FormComponent({
  handler,
}: {
  handler: (
    language: string,
    input: string
  ) => Promise<
    { error: string; response?: undefined } | { response: string; error?: undefined }
  >;
}) {
  const [data, setData] = useState<{ language: string; input: string }>({
    language: "",
    input: "",
  });

  const [aiResponse, setAiresponse] = useState<string | undefined>(undefined);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(() => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async () => {
    const result = await handler(data.language, data.input);
    if (result.error) setAiresponse(result.error);
    else setAiresponse(result.response);
  };
  return (
    <form onSubmit={(e) => e.preventDefault()} className='flex flex-col gap-2'>
      <input
        type='text'
        name='language'
        placeholder='Enter the Language'
        onChange={(e) => handleChange(e)}
        className='border border-gray-400 rounded-xl p-2 outline-none'
      />
      <input
        type='text'
        name='input'
        placeholder='Enter the Prompt'
        onChange={(e) => handleChange(e)}
        className='border border-gray-400 rounded-xl p-2 outline-none'
      />
      <button
        onClick={handleSubmit}
        className='bg-blue-400 hover:bg-blue-200 cursor-pointer p-2 rounded-xl'
      >
        Submit
      </button>
      <p>{aiResponse}</p>
    </form>
  );
}

export default FormComponent;
