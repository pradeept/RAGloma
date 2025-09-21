import React from "react";
import InputBox from "./inputBox";

function Chat() {
  return (
    <div className="w-full">
      <InputBox chatWithDoc={true} chatWithURL={false} />
    </div>
  );
}

export default Chat;
