"use client";
import { Link, Paperclip, X } from "lucide-react";
import React, { useState, useRef } from "react";

function InputBox({
  chatWithDoc,
  chatWithURL,
}: {
  chatWithDoc: boolean;
  chatWithURL: boolean;
}) {
  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", prompt);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  return (
    <section>
      <div className='rounded'>
        <form onSubmit={handlePrompt}>
          <textarea
            name='chat-input'
            className='min-h-20 w-full p-1 resize-none  text-black dark:text-white focus:outline-none border'
            rows={2}
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            onKeyDown={handleKeyDown}
            placeholder='Enter your prompt here.. (Enter to send, Shift+Enter for newline)'
          />
        </form>

        {chatWithDoc && (
          <div className='mt-2 px-2 pb-1'>
            <input
              type='file'
              id='fileUpload'
              ref={fileInputRef}
              className='hidden'
              onChange={handleFileChange}
            />
            <label
              htmlFor='fileUpload'
              className='cursor-pointer flex items-center gap-1'
            >
              <Paperclip />
              <small>Attach your file</small>
            </label>

            {/* Show selected file name with remove button */}
            {selectedFile && (
              <div className='flex items-center justify-between mt-1 text-sm text-gray-600 border p-1 rounded'>
                <span className='truncate'>📄 {selectedFile.name}</span>
                <button
                  type='button'
                  onClick={handleRemoveFile}
                  className='ml-2 text-red-500 hover:text-red-700'
                  title='Remove file'
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {chatWithURL && (
          <div className='flex justify-center items-center gap-2 mt-2'>
            <Link size={22} />
            <input
              type='text'
              placeholder='Enter your URL here'
              className='w-full border p-1 focus:outline-none focus:bg-black text-white bg-transparent'
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default InputBox;
