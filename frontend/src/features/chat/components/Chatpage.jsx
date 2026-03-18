import React from "react";

const ChatPage = () => {

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const messages = [
    { id: 1, sender: "ai", text: "Hello Tushar 👋 How can I help you?" },
    { id: 2, sender: "user", text: "I want to build Perplexity UI." },
    { id: 3, sender: "ai", text: "Great. Let's design chat bubbles first." },
    { id: 4, sender: "user", text: "Also make input fixed at bottom." },
    { id: 5, sender: "ai", text: "Done ✅ Now messages will scroll." },
  ];

  return (
    <div className="h-full w-full flex-1 flex flex-col">

      {/* ⭐ NAVBAR SAME AS HOME */}
      <div className="nav w-full flex px-4 py-6 justify-between">
        <div className='px-4 py-2 hover:bg-zinc-800 rounded-xl cursor-pointer'>
          <h1 className='font-semibold text-2xl'>Perplexity</h1>
        </div>

        <div className="links px-4 py-2 hover:bg-zinc-800 rounded-xl cursor-pointer">
          <h4 className='text-xl font-medium'>Group Chat</h4>
        </div>
      </div>

      {/* ⭐ MESSAGES AREA (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-10 py-4 flex flex-col gap-4">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[60%] px-4 py-3 rounded-2xl ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-gray-800 text-gray-200 rounded-bl-md"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

      </div>

      {/* ⭐ INPUT AREA (Bottom Fixed in layout flow) */}
      <div className="w-full px-10 py-4 border-t border-gray-800">

        <div className="search w-full flex items-center px-4 py-2 bg-gray-800 rounded-3xl">

          <h4 className='text-xl mr-2 cursor-pointer'>➕</h4>

          <textarea
            rows={1}
            onInput={handleInput}
            placeholder="Ask anything..."
            className='w-full bg-transparent font-sans px-2 border-0 outline-0 py-2 resize-none overflow-hidden max-h-40'
          />

          <h4 className='text-xl mx-2 cursor-pointer'>🎙️</h4>

          <div className='rounded-full cursor-pointer bg-gray-900'>
            
            <button className='px-4 cursor-pointer rounded-md py-2 text-md font-md hover:bg-blue-600 '>send</button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ChatPage;