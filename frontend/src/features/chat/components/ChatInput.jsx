import React from "react";

const ChatInput = () => {
  return (
    <div className="p-4 border-t border-gray-800 bg-[#181818]">
      <div className="bg-[#2a2a2a] rounded-full flex items-center px-4 py-3">
        <input
          type="text"
          placeholder="Ask anything"
          className="bg-transparent outline-none flex-1 text-gray-200"
        />
        <button className="bg-white text-black px-4 py-1 rounded-full">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;