import Chat from "@/components/chat/chat";
import React from "react";

function page() {
  return (
    <section>
      <div className='flex justify-center md:mx-[20%] mx-[2%] border'>
        <Chat />
      </div>
    </section>
  );
}

export default page;
