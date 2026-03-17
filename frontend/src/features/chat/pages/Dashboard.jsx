import React,{useState} from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat';
import { useEffect } from 'react';

import Sidebar from '../components/SideBar';
import Home from '../components/Home';
import ChatPage from '../components/Chatpage';


const Dashboard = () => {
 const user = useSelector(state => state.auth.user);
  const chat = useChat();
  const [chatStarted, setChatStarted] = useState(false);

  useEffect(()=>{
    chat.initializeSocketConnection();
  })

 console.log(user);
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        {chatStarted ? <ChatPage /> : <Home />}
      </div>
    </div>
  )
}

export default Dashboard