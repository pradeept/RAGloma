"use client";
import { useChatStore } from "@/store/chatStore";
import { Check, Link, Paperclip, ShieldAlert, X } from "lucide-react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<
    undefined | boolean | "loading"
  >(undefined);

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

  useEffect(() => {
    setUploadStatus(undefined);
  }, [selectedFile]);

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
    const url = `${base}/api/chat?prompt=${encodeURIComponent(
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

  const handleUpload = async () => {
    setUploadStatus("loading");
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await fetch("/api/doc-chat/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          return res.json();
        })
        .then((body: { message: string; error: null | string }) => {
          if (!body.error) {
            setUploadStatus(true);
          }
        })
        .catch((e) => {
          console.error(e);
          setUploadStatus(false);
        });
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
            <div className='flex justify-between items-center'>
              {/* Select file */}
              <div>
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
              </div>
              {/* Upload button */}
              <div className='flex items-center gap-1'>
                <button
                  onClick={handleUpload}
                  className='border p-1 rounded m-1 cursor-pointer disabled:cursor-not-allowed'
                  disabled={!selectedFile || uploadStatus === true}
                >
                  {uploadStatus === "loading" ? "Uploading..." : "Upload"}
                </button>
                {uploadStatus === true && (
                  <span title='File uploaded successfully'>
                    <Check className='text-green-400' />
                  </span>
                )}
                {uploadStatus === false && (
                  <span title='failed to upload the file'>
                    <ShieldAlert className='text-red-400' />
                  </span>
                )}
              </div>
            </div>

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
                <SelectItem value='perplexity'>Perplexity</SelectItem>
                <SelectItem value='gemma'>Gemma</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
