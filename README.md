<center>
 <h1>RAGloma</h1>
 <p>A modern fullstack app for chatting with LLMs, documents, or a web links.</p>
</center>

## 🧩 Pre-requisites

- Node.js — version 20 or higher
- Ollama — Download here
- LLM — gemma3:4b, or any other model supported by your system specifications
- Embedding Model — dengcao/Qwen3-Embedding-0.6B:Q8_0
- Minimum Free RAM — 8 GB

## 🛠️ Tech Stack

```
- Nextjs
- Langchain
- Perplexity API
- Ollama
- Pinecone
- Upstash (Redis)
```

## 💬 Modes

1. **Chatbot** — Talk directly with your chosen LLM.
2. **Chat with Document** — Perform RAG-based queries using your uploaded files.
3. **Chat with URL** _(coming soon)_ — Interact with web content directly.

## ✨ Features

- Chat with **Perplexity API** for up-to-date responses.
- Chat with **local LLMs** via **Ollama** (offline).
- Use **RAG (Retrieval-Augmented Generation)** to chat with your documents.
- Simple UI to switch between:
  - Chat with LLM
  - Chat with Document
  - Chat with URL _(coming soon)_

## 🔮 Upcoming Enhancements

- Namespace-based vector separation for files.
- Contextual memory for persistent conversations.
- Middleware to limit API requests and prevent overuse.

## ⚙️ Example `.env` Configuration

```bash
PERPLEXITY_API_KEY=""
NEXT_PUBLIC_HOST="http://localhost:3000"
EMBEDDING_MODEL="dengcao/Qwen3-Embedding-0.6B:Q8_0" # Ollama
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="gemma3:4b"
PINECONE_KEY=""
UPSTASH_REDIS_URL="" # for rate-limiter
UPSTASH_REDIS_TOKEN="" # for rate-limiter
```

## 🤝 Contributing

We appriciate contributions! Please follow
[CONTRIBUTING.md]() for more infromation.

## 🙌 Credits

1. [Next.js](https://nextjs.org/)
   — for an amazing framework
2. [LangChain.js](https://js.langchain.com/)
   — for simplifying complex LLM integrations and RAG workflows.
3. [Ollama](https://ollama.com/)
   — for letting me run LLMs on my half-alive laptop!
4. [Perplexity API](https://www.perplexity.ai/)
   — for sparking the idea of building an RAG application.

---

<div align='center'>
    Thank you for checking out this project. Please leave a ⭐ if you find this helpful.
</div>
