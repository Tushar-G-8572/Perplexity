import React from "react";
import ChatInput from "./chatInput";

const ChatPage = () => {
  return (
    <div className="flex flex-col h-screen bg-[#181818] text-white">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        <div className="flex justify-end">
          <div className="bg-[#2a2a2a] px-4 py-2 rounded-xl max-w-xl">
            what is logger ?
          </div>
        </div>

        <div className="flex justify-start">
          <div className="bg-[#202020] px-4 py-3 rounded-xl max-w-xl">
            Logger is a tool used to track application events.
          </div>
        </div>

      </div>

      <ChatInput />

    </div>
  );
};

export default ChatPage;