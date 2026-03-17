import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#0f0f0f] text-gray-300 h-screen flex flex-col border-r border-gray-800">
      
      <div className="p-4 border-b border-gray-800">
        <button className="w-full bg-[#1a1a1a] hover:bg-[#262626] p-2 rounded-lg">
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="hover:bg-[#1a1a1a] p-2 rounded cursor-pointer">
          Logger and Morgan Explanation
        </div>
        <div className="hover:bg-[#1a1a1a] p-2 rounded cursor-pointer">
          What is PWA
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="text-sm">Tushar Gupta</div>
        <div className="text-xs text-gray-500">Go Plan</div>
      </div>

    </div>
  );
};

export default Sidebar;