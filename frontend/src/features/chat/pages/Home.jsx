import React from 'react'
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router';import { MdGroupAdd } from "react-icons/md";


const Home = () => {
    const navigate = useNavigate();
    const [chatInput, setChatInput] = useState('');
    const chat = useChat();

    const chats = useSelector((state) => state.chat.chats);

    const currentChatId = useSelector((state) => state.chat.currentChatId)


    const handleInput = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const trimmedMessage = chatInput.trim();
        if (!trimmedMessage) return;
        
        setChatInput('');
        const newChatId = await chat.handleSendMessage({
            message: trimmedMessage,
            chatId: currentChatId
        });
        console.log(newChatId);
        if (newChatId) {
            navigate(`/chat/${newChatId}`);
        }

    }

    return (
        <div className="h-full  w-full flex-1">
            <div className="nav w-full flex px-4 py-6 justify-between ">
                <div className='px-4 py-2 hover:bg-zinc-800 rounded-xl cursor-pointer ' >
                    <h1 className='font-semibold text-2xl '>Perplexity</h1>
                </div>
                <div className="links px-4 py-2 hover:bg-zinc-800 rounded-xl cursor-pointer ">
                    <h4 className='text-3xl font-medium'><MdGroupAdd /></h4>
                </div>
            </div>
            <div className="flex h-4/5 w-full flex-col justify-center gap-4 items-center">
                <h1 className='font-sans text-3xl'>
                    Hello Tushar how can I help you today?
                </h1>

                <div className="search w-3/5 flex items-center text-center px-4 py-2 bg-gray-900 rounded-3xl">

                    <textarea
                        rows={1}
                        onInput={handleInput}
                        value={chatInput}
                        onChange={(e) => { setChatInput(e.target.value) }}
                        placeholder="Ask anything..."
                        className='w-full bg-transparent font-sans px-2 border-0 outline-0 py-2 resize-none overflow-hidden'
                    />


                    <div className='rounded-md  bg-gray-950'>
                        <button onClick={handleSubmit} className='px-6 cursor-pointer rounded-md py-2 text-md font-md hover:bg-gray-800 active:scale-2 '>send</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Home