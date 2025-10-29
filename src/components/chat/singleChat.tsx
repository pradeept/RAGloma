"use client";
import { useChatStore } from "@/store/chatStore";
import { Bot, UserRound } from "lucide-react";
import React from "react";
import { motion } from "motion/react";

type Chat = {
  id: number;
  sender: string;
  message: string;
};

function SingleChat({ chat }: { chat: Chat }) {
  const isStreaming = useChatStore((state) => state.isStreaming);
  const streamingChatId = useChatStore((state) => state.streamingChatId);
  return (
    <div
      className={`mt-8 flex gap-1 items-center my-4 ${
        chat.sender === "ai" ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`dark:bg-slate-800 bg-slate-300 rounded-full p-1.5 ${
          chat.sender === "human" && "order-2"
        }`}
      >
        {chat.sender === "ai" ? <Bot /> : <UserRound />}
      </div>
      <div
        className={` flex flex-col rounded-xl w-auto px-3 py-1.5 max-w-full dark:text-slate-50 text-gray-900 ${
          chat.sender === "ai"
            ? "dark:bg-purple-900 bg-purple-400 order-1"
            : "dark:bg-blue-600 bg-blue-300"
        }`}
      >
        <p className="text-md">
          {" "}
          {chat.message}{" "}
          {isStreaming && chat.id === streamingChatId && (
            <motion.span
              key={chat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className='ml-1 font-semibold text-md'
            >
              |
            </motion.span>
          )}
        </p>
      </div>
    </div>
  );
}

export default SingleChat;
