import React from 'react'
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import { useState } from 'react';
import { useNavigate } from 'react-router';


const Home = ({ setChatStarted }) => {
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

        const res = await chat.handleSendMessage({
            message: trimmedMessage,
            chatId: currentChatId
        });

        const newChatId = res?.chat?._id;

        if (newChatId) {
            navigate(`/chat/${newChatId}`, {
                state: {
                    firstMessage: trimmedMessage,
                    aiMessage: res?.aiMessage
                }
            });
        }

        setChatInput('');
    }

    return (
        <div className="h-full  w-full flex-1">
            <div className="nav w-full flex px-4 py-6 justify-between ">
                <div className='px-4 py-2 hover:bg-zinc-800 rounded-xl cursor-pointer ' >
                    <h1 className='font-semibold text-2xl '>Perplexity</h1>
                </div>
                <div className="links px-4 py-2 hover:bg-zinc-800 rounded-xl cursor-pointer ">
                    <h4 className='text-xl font-medium'>Group Chat</h4>
                </div>
            </div>
            <div className="flex h-4/5 w-full flex-col justify-center gap-4 items-center">
                <h1 className='font-sans text-3xl'>
                    Hello Tushar how can I help you today?
                </h1>

                <div className="search w-3/5 flex items-center text-center px-4 py-2 bg-gray-800 rounded-3xl">

                    <h4 className='text-xl mr-2 cursor-pointer '>➕</h4>

                    <textarea
                        rows={1}
                        onInput={handleInput}
                        value={chatInput}
                        onChange={(e) => { setChatInput(e.target.value) }}
                        placeholder="Ask anything..."
                        className='w-full bg-transparent font-sans px-2 border-0 outline-0 py-2 resize-none overflow-hidden'
                    />

                    <h4 className='text-xl mx-2 cursor-pointer '>🎙️</h4>

                    <div className='rounded-md  bg-gray-900'>
                        {/* <h4 className='px-3 py-2 text-xl'>⬆️</h4> */}
                        <button onClick={handleSubmit} className='px-4 cursor-pointer rounded-md py-2 text-md font-md hover:bg-blue-600 '>send</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Home