import React from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat';
import { useEffect } from 'react';


const Dashboard = () => {
 const user = useSelector(state => state.auth.user);
  const chat = useChat();

  useEffect(()=>{
    chat.initializeSocketConnection();
  })

 console.log(user);
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard