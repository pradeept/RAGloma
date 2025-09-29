import Chat from "@/components/chat/chat";
import React from "react";

function RAG() {
  // fetch("http://localhost:3000/api/rag");
  return (
    <div>
      <section>
        <div className='flex justify-center md:mx-[20%] mx-[2%] '>
          <Chat />
        </div>
      </section>
    </div>
  );
}

export default RAG;
