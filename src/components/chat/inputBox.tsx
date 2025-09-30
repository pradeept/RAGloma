"use client";
import { useChatStore } from "@/store/chatStore";
import { Link, Paperclip, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname } from "next/navigation";

function InputBox({}) {
  const addChat = useChatStore((state) => state.addChat);
  const getChatsLength = useChatStore((state) => state.getChatsLength);
  const updateChat = useChatStore((state) => state.updateChat);
  const llm = useChatStore((state) => state.llm);
  const setLlm = useChatStore((state) => state.setLlm);
  const mode = useChatStore((state) => state.mode);
  const setMode = useChatStore((state) => state.setMode);
  const setIsChatLoading = useChatStore((state) => state.setIsChatLoading);
  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const path = usePathname();

  useEffect(() => {
    switch (path) {
      case "chat":
        setMode("chat");
        break;
      case "/doc-chat":
        setMode("doc-chat");
        break;
      case "/url-chat":
        setMode("url-chat");
        break;
    }
  }, [path, setMode]);

  useEffect(() => {
    if (mode === "doc-chat" || mode === "url-chat") setLlm("gemma");
  }, [mode, setLlm]);

  const handlePrompt = (e: React.FormEvent) => {
    e.preventDefault();

    const baseId = getChatsLength();
    const humanId = baseId + 1;
    const aiId = baseId + 2;

    addChat({ id: humanId, sender: "human", message: prompt });
    addChat({ id: aiId, sender: "ai", message: "" });

    const base =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_HOST;
    const url = `${base}/api/chat?prompt=${encodeURIComponent(prompt)}`;
    const eventSource = new window.EventSource(url);
    setIsChatLoading(true, aiId);
    eventSource.onmessage = (event) => {
      updateChat(aiId, event.data);
    };

    eventSource.onerror = (error) => {
      console.error(error);
      updateChat(aiId, "error: Something went wrong!");
      eventSource.close();
      setIsChatLoading(false, aiId);
    };

    eventSource.addEventListener("end", () => {
      setIsChatLoading(false, aiId);
      eventSource.close();
    });

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
    <section className='mb-2'>
      <div>
        <form onSubmit={handlePrompt}>
          <textarea
            name='chat-input'
            className='min-h-20 w-full px-2 py-1 resize-none rounded text-black dark:text-white focus:outline-none border transition-all'
            rows={2}
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            onKeyDown={handleKeyDown}
            placeholder='Enter your prompt here.. (Enter to send, Shift+Enter for newline)'
          />
        </form>

        {mode === "doc-chat" && (
          <div className='p-2 border'>
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

        {mode === "url-chat" && (
          <div className='flex justify-center items-center gap-2 mt-2'>
            <Link size={22} />
            <input
              type='text'
              placeholder='Enter your URL here'
              className='w-full border p-1 focus:outline-none focus:bg-black text-white bg-transparent'
            />
          </div>
        )}
        {/* Model selection */}
        <div className='absolute right-0 mt-1'>
          <Select
            onValueChange={(val) => setLlm(val as "perplexity" | "gemma")}
          >
            <SelectTrigger>
              <SelectValue placeholder={llm} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='Perplexity'>Perplexity</SelectItem>
                <SelectItem value='Gemma'>Gemma</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}

export default InputBox;
