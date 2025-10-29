"use client";
import React, { useEffect, useRef } from "react";
import SingleChat from "./singleChat";
import { useChatStore } from "@/store/chatStore";

function ChatWindow() {
  const chats = useChatStore((state) => state.chats);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatsLength = useChatStore((state) => state.chats.length);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatsLength]);

  return (
    <div className='p-4 overflow-y-auto no-scrollbar'>
      {chats.map((chat) => {
        return <SingleChat chat={chat} key={chat.id} />;
      })}
      <div ref={chatContainerRef} />
    </div>
  );
}

export default ChatWindow;
