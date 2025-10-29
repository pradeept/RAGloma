import React from "react";
import InputBox from "./inputBox";
import ChatBox from "./chatWindow";

async function Chat() {
  return (
    <div className='w-full flex flex-col flex-1 h-full '>
      <div className='flex-1 min-h-0'>
        <ChatBox />
      </div>
      <div className='sticky bottom-0 bg-background z-10'>
        <InputBox />
      </div>
    </div>
  );
}

export default Chat;
