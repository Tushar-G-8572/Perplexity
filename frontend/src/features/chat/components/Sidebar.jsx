import React from 'react'
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import { useEffect } from 'react';
import { useNavigate } from 'react-router'
import { BsPerplexity } from "react-icons/bs";
import { CgSidebarOpen } from "react-icons/cg";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosArrowDropdown } from "react-icons/io";
import { MdOutlineAdd } from "react-icons/md";

export const formatChatTitle = (title = "") => {
  const clean = title
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/"/g, "")
    .replace(/#/g, "")
    .replace(/\n/g, " ")
    .trim();

  return clean.length > 40 ? clean.slice(0, 40) + "..." : clean;
};

const Sidebar = () => {

    const navigate = useNavigate();
    const chat = useChat();

    const chats = useSelector((state) => state.chat.chats)
    // console.log(chats)
    const currentChatId = useSelector((state) => state.chat.currentChatId)
    const loading = useSelector(state=>state.chat.isLoading);


    const {handleNewChat} = chat
    const handleNewChats = () => {

        handleNewChat();
        navigate('/', { replace: true })   // ⭐ history clean

    }

    useEffect(() => {
        chat.handleGetChats()
    }, [])

    return (
        <div className="h-full w-80 border-2 rounded-md border-gray-800 flex flex-col">

            <div className="flex-shrink-0">

                <div className="icons w-full px-4 py-2 flex justify-between">
                    <div onClick={()=>{handleNewChats()}} className='hover:bg-gray-800 flex justify-center p-1 rounded-2xl'>
                        <h4  className='text-4xl cursor-pointer'><BsPerplexity /></h4>
                    </div>
                    <div className='hover:bg-gray-800 flex justify-center p-1 rounded-2xl'>
                        <h4 className='text-3xl cursor-pointer'><CgSidebarOpen /></h4>
                    </div>
                </div>

                <div className="chats border-t-2 border-gray-700 flex flex-col gap-3 w-full px-4 py-2">
                    <div onClick={() => { handleNewChats() }} className='flex gap-2 border-b-2 hover:bg-gray-800 px-4 py-2 rounded-2xl cursor-pointer'>
                        <h4 className='text-2xl' ><MdOutlineAdd /></h4>
                        <h4>New Chat</h4>
                    </div>

                    <div className='flex gap-2 border-b-2 hover:bg-gray-800 px-4 py-2 rounded-2xl cursor-pointer'>
                        <h4 className='text-2xl'><IoSearchSharp /></h4>
                        <h4>Search Chat</h4>
                    </div>
                </div>

            </div>

            <div className="flex-1 overflow-y-auto mt-4 px-4 py-2 chatlist scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">

                <div className='flex gap-2 items-center mb-3'>
                    <h4 className='font-bold'>Your Chats</h4>
                    <h4 className='text-2xl'><IoIosArrowDropdown /></h4>
                </div>

                <ul className='flex flex-col gap-2'>
                    {Object.values(chats).map((chat, index) => (
                        <li onClick={() => { navigate(`/chat/${chat.id}`) }}
                            key={index}
                            className='px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition'
                        >
                            <h4>{formatChatTitle(chat.title)}</h4>

                        </li>
                    ))}
                </ul>

            </div>

        </div>
    )
}

export default Sidebar