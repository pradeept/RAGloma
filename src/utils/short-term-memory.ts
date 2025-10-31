import { AIMessage, HumanMessage } from "@langchain/core/messages";

class STM {
  store = new Map<string, (AIMessage | HumanMessage)[]>();
  constructor() {}
  insertNewConversation = (
    sessionId: string,
    conversation: AIMessage | HumanMessage
  ) => {
    const messages = this.store.get(sessionId);

    if (messages && messages.length > 5) {
      this.trimMessages(sessionId);
    }

    if (this.store.has(sessionId)) {
      this.store.get(sessionId)?.push(conversation);
    } else {
      this.store.set(sessionId, [conversation]);
    }
  };

  trimMessages = (sessionId: string) => {
    if (this.store.has(sessionId)) {
      const messages = this.store.get(sessionId);
      if (messages && messages?.length > 1) {
        this.store.set(sessionId, messages.slice(1));
      }
    }
  };

  hasMessages = (sessionId: string) => {
    return this.store.get(sessionId);
  };

  getMessages = (sessionId: string): (AIMessage | HumanMessage)[] | null => {
    console.log("current store: ", this.store);
    if (this.store.has(sessionId)) {
      const messages = this.store.get(sessionId);
      return !messages ? null : messages;
    } else {
      return null;
    }
  };
}

export const stm = new STM();
