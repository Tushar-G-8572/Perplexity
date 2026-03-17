import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#181818] text-white">
      
      <h1 className="text-4xl font-semibold mb-8">
        What can I help with?
      </h1>

      <div className="w-100 bg-[#2a2a2a] rounded-full flex items-center px-4 py-3">
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

export default Home;