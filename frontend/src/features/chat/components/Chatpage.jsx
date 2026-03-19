import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import Sidebar from "./Sidebar";

const ChatPage = () => {
    const [chatInput, setChatInput] = useState('')
    const { chatId } = useParams();
    const location = useLocation();
    // console.log(chatId);

    const chat = useChat();
    const { handleSendMessage, handleOpenChat } = chat;
    const chats = useSelector(state => state.chat.chats[chatId])
    console.log(chats)
    useEffect(() => {
        handleOpenChat(chatId)
    }, [chatId])

    const messages = chats?.messages || [];

    console.log(messages);

    const firstMessage = location.state?.firstMessage;
    const aiMessage = location.state?.aiMessage;

    const handleInput = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const trimmedMessage = chatInput.trim();
        if (!trimmedMessage) return;
        await handleSendMessage({
            message: trimmedMessage,
            chatId: chatId
        })
    }


    return (
        <section className='bg-gray-950 text-gray-200 h-screen border-0 w-full'>
            <div className="main w-full h-screen flex px-2 py-1 gap-1 ">
                <Sidebar />
                <div className="h-full w-full flex-1 flex flex-col">

                    <div className="nav w-full flex px-4 py-6 justify-between">
                        <div className='px-4 py-2 hover:bg-zinc-800 rounded-xl cursor-pointer'>
                            <h1 className='font-semibold text-2xl'>Perplexity</h1>
                        </div>

                        <div className="links px-4 py-2 hover:bg-zinc-800 rounded-xl cursor-pointer">
                            <h4 className='text-xl font-medium'>Group Chat</h4>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-10 py-4 flex flex-col gap-4">

                        {messages.map((msg,idx) => (
                            <div
                                key={idx}
                                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[60%] px-4 py-3 rounded-2xl ${msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-br-md"
                                        : "bg-gray-800 text-gray-200 rounded-bl-md"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                    </div>

                    <div className="w-full px-10 py-4 border-t border-gray-800">

                        <div className="search w-full flex items-center px-4 py-2 bg-gray-800 rounded-3xl">

                            <h4 className='text-xl mr-2 cursor-pointer'>➕</h4>

                            <textarea
                                rows={1}
                                onInput={handleInput}
                                value={chatInput}
                                onChange={(e) => { setChatInput(e.target.value) }}
                                placeholder="Ask anything..."
                                className='w-full bg-transparent font-sans px-2 border-0 outline-0 py-2 resize-none overflow-hidden max-h-40'
                            />

                            <h4 className='text-xl mx-2 cursor-pointer'>🎙️</h4>

                            <div className='rounded-full cursor-pointer bg-gray-900'>

                                <button onClick={handleSubmit} className='px-4 cursor-pointer rounded-md py-2 text-md font-md hover:bg-blue-600 '>send</button>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default ChatPage;