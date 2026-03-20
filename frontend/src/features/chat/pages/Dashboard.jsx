import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat';
import { useEffect } from 'react';

import Sidebar from '../components/Sidebar.jsx';
import Home from './Home.jsx';
import ChatPage from '../components/ChatPage.jsx';



const Dashboard = () => {
  const chat = useChat();
  const {handleSendMessage} = chat;
  // const [chatStarted, setChatStarted] = useState(false);

  useEffect(() => {
    chat.initializeSocketConnection();
  }, [])

   return (
    <section className='bg-black text-gray-200 h-screen border-0 w-full'>
      <div className="main w-full h-screen flex px-2 py-1 gap-1 ">
        <Sidebar />
        <Home />   
      </div>
    </section>
  )
}

export default Dashboard