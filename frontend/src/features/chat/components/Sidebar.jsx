import React from 'react'

const Sidebar = () => {
      const chatTitles = [
    "React Performance Tips",
    "Socket.IO Room Issue",
    "MongoDB Aggregation Help",
    "Node Auth Flow Debug",
    "Tailwind Layout Fix",
    "GSAP Animation Ideas",
    "Typing Game Multiplayer",
    "LAN File Sharing App",
    "Interview Preparation JS",
    "Cloud DevOps Roadmap",
    "AI Integration in MERN",
    "Dark Mode UI Design",
    "Redux vs Context",
    "API Rate Limiting",
    "JWT Refresh Token Flow",
    "WebRTC Video Chat",
    "Infinite Scroll Logic",
    "Search Bar Auto Resize",
    "Navbar Sticky Problem",
    "Deployment on AWS"
  ];
  return (
    <div className="h-full w-80 border-2 rounded-md border-gray-800 flex flex-col">

          {/* 🔥 Fixed Top Area */}
          <div className="flex-shrink-0">

            <div className="icons w-full px-4 py-2 flex justify-between">
              <div className='hover:bg-gray-800 flex justify-center p-1 rounded-2xl'>
                <h4 className='text-4xl cursor-pointer'>🔥</h4>
              </div>
              <div className='hover:bg-gray-800 flex justify-center p-1 rounded-2xl'>
                <h4 className='text-3xl cursor-pointer'>🛝</h4>
              </div>
            </div>

            <div className="chats border-t-2 border-gray-700 flex flex-col gap-3 w-full px-4 py-2">
              <div className='flex gap-2 border-b-2 hover:bg-gray-800 px-4 py-2 rounded-2xl cursor-pointer'>
                <h4>➕</h4>
                <h4>New Chat</h4>
              </div>

              <div className='flex gap-2 border-b-2 hover:bg-gray-800 px-4 py-2 rounded-2xl cursor-pointer'>
                <h4>🔍</h4>
                <h4>Search Chat</h4>
              </div>
            </div>

          </div>

          {/* ⭐ Scrollable Chat List */}
          <div className="flex-1 overflow-y-auto mt-4 px-4 py-2 chatlist scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">

            <div className='flex gap-2 items-center mb-3'>
              <h4 className='font-bold'>Your Chats</h4>
              <h4>⬇️</h4>
            </div>

            <ul className='flex flex-col gap-2'>
              {chatTitles.map((title, index) => (
                <li
                  key={index}
                  className='px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition'
                >
                  {title}
                </li>
              ))}
            </ul>

          </div>

        </div>
  )
}

export default Sidebar