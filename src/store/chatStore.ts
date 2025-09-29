import { create } from "zustand";

type Chat = {
  id: number;
  sender: "ai" | "human";
  message: string;
};

export interface ChatStoreState {
  chats: Chat[];
  llm: "perplexity" | "gemma";
  mode: "chat" | "doc-chat" | "url-chat";
  isStreaming: boolean;
  streamingChatId: undefined | number;

  setMode: (mode: "chat" | "doc-chat" | "url-chat") => void;
  setLlm: (llm: "perplexity" | "gemma") => void;
  addChat: (chat: Chat) => void;
  updateChat: (index: number, message: string) => void;
  getChatsLength: () => number;
  setIsChatLoading: (val: boolean, id: number) => void;
  clearChats: () => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  //initial state
  chats: [],
  llm: "gemma",
  mode: "chat",
  isStreaming: false,
  streamingChatId: undefined,

  // set the mode
  setMode: (mode) => {
    set((state) => ({
      ...state,
      mode,
    }));
  },

  // set the LLM
  setLlm: (llm) => {
    set((state) => ({
      ...state,
      llm,
    }));
  },

  // add new chat
  addChat: (chat) => {
    set((state: ChatStoreState) => ({
      ...state,
      chats: [...state.chats, chat],
    }));
  },

  updateChat: (id, message) => {
    set((state: ChatStoreState) => {
      const updatedChats = [...state.chats];
      const index = updatedChats.findIndex((chat) => chat.id === id);
      if (index != 0) {
        updatedChats[index] = {
          ...updatedChats[index],
          message: updatedChats[index].message + " " + message,
        };
      }
      return {
        ...state,
        chats: updatedChats,
      };
    });
  },

  getChatsLength: () => {
    const { chats } = get();
    return chats.length;
  },

  setIsChatLoading: (val, id) => {
    set((state) => ({ ...state, isStreaming: val, streamingChatId: id }));
  },

  // clear chats
  clearChats: () => {
    set((state: ChatStoreState) => ({
      ...state,
      chats: [],
    }));
  },
}));
