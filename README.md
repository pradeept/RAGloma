<center>
 <h1>RAGloma</h1>
 <p>In Progress - A modern fullstack app to chat with LLMs or a Document or a valid link.</p>
</center>

## Tech Stack

```
- Nextjs
- Langchain
- Perplexity API
```

--- 
### Modes
1) Chatbot
2) Chat with document
3) Chat with URL

### Goal

- UI with Chat with LLM, Chat with Doc, Chat with link modes.
- Documents and document loaders; ✅
- Text splitters; ✅
- Embeddings; ✅
- Vector stores and retrievers. ✅
- Integrate LLM with response streaming; ✅
- Check the vector db for doc hash before creating and adding embeddings for a doc. ✅ 

### In - Progress: 
- Make chat window in doc-chat functional
- Add middleware to limit number of requests.


### Example .env

```shell
PERPLEXITY_API_KEY=""
NEXT_PUBLIC_HOST="http://localhost:3000"
EMBEDDING_MODEL="dengcao/Qwen3-Embedding-0.6B:Q8_0" #ollama 
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="gemma3:4b"
PINECONE_KEY=""
#optional
UPSTASH_REDIS_URL="" 
UPSTASH_REDIS_TOKEN=""
```