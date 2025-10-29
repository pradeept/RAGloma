"use client";
import { useChatStore } from "@/store/chatStore";
import { Link } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname } from "next/navigation";
import FileUpload from "./fileUpload";

export default function InputBox() {
  const addChat = useChatStore((state) => state.addChat);
  const getChatsLength = useChatStore((state) => state.getChatsLength);
  const updateChat = useChatStore((state) => state.updateChat);
  const llm = useChatStore((state) => state.llm);
  const setLlm = useChatStore((state) => state.setLlm);
  const mode = useChatStore((state) => state.mode);
  const setMode = useChatStore((state) => state.setMode);
  const setIsChatLoading = useChatStore((state) => state.setIsChatLoading);
  const [prompt, setPrompt] = useState("");

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

    // stream llm response to store
    const base =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_HOST;
    const url = `${base}/api/${mode}?prompt=${encodeURIComponent(
      prompt
    )}&llm=${llm}`;

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

  // new-line and prompt submission handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
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

        {mode === "doc-chat" && <FileUpload />}

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
                {mode === "chat" && (
                  <SelectItem value='perplexity'>perplexity</SelectItem>
                )}
                <SelectItem value='gemma'>gemma</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
