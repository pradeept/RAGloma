"use client";
import React, { FormEvent, useState } from "react";
import DisplayResponse from "./DisplayResponse";

function FormComponent() {
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [input, setInput] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseText, setResponseText] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResponseText("");
    setLoading(true);
    // Use EventSource for SSE
    // NOTE: Fetch is not a best option for SSE
    const url = `http://localhost:3000/api/perplexity?language=${language}&text=${input}`;
    const eventSource = new window.EventSource(url);

    eventSource.onmessage = (event) => {
      // Each event.data is a chunk
      setResponseText((prev) => prev + event.data);
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      setLoading(false);
      eventSource.close();
    };

    eventSource.addEventListener("end", () => {
      setLoading(false);
      eventSource.close();
    });
  };
  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className='w-full max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-6'
    >
      <input
        type='text'
        name='language'
        placeholder='Enter the Language (e.g. French)'
        onChange={(e) => setLanguage(e.target.value)}
        className='border border-gray-300 rounded-xl p-3 outline-none focus:border-blue-400 transition duration-200 text-lg bg-gray-50'
        autoComplete='off'
      />
      <input
        type='text'
        name='input'
        placeholder='Enter the Prompt (e.g. I love programming)'
        onChange={(e) => setInput(e.target.value)}
        className='border border-gray-300 rounded-xl p-3 outline-none focus:border-blue-400 transition duration-200 text-lg bg-gray-50'
        autoComplete='off'
      />
      <button
        type='submit'
        className='bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white cursor-pointer p-3 rounded-xl text-xl font-semibold shadow-md transition duration-200 flex items-center justify-center gap-2'
        disabled={loading}
      >
        {loading ? (
          <span className='animate-pulse'>Translating...</span>
        ) : (
          <>
            GO{" "}
            <span role='img' aria-label='run'>
              🏃‍♂️💨
            </span>
          </>
        )}
      </button>
      <DisplayResponse responseText={responseText} loading={loading} />
    </form>
  );
}

export default FormComponent;
