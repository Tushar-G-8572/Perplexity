import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import Sidebar from "./Sidebar";
import { MdGroupAdd } from "react-icons/md";

import MarkdownMessage from "./MarkDownMessage";

const formatMarkdown = (text) => {
    if (!text) return "";

    return text
        .replace(/\r\n/g, "\n")

        // ⭐ VERY IMPORTANT → force new line before bullet
        .replace(/\s\*\s/g, "\n\n* ")

        // ⭐ force new line before headings
        .replace(/\*\*([^*]+)\*\*:/g, "\n\n**$1**:")

        // remove too many new lines
        .replace(/\n{3,}/g, "\n\n")

        .trim();
};


const ChatPage = () => {
    const [chatInput, setChatInput] = useState("");
    const { chatId } = useParams();
    const chatEndRef = useRef(null);

    const chat = useChat();
    const { handleSendMessage, handleOpenChat } = chat;

    const chats = useSelector(state => state.chat.chats[chatId]);
    // const chats  = useSelector(state => state.chat.chats)
    const messages = chats?.messages || [];

    useEffect(() => {
        handleOpenChat(chatId,chats);
    }, [chatId]);

    // ⭐ Auto Scroll Bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleInput = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const trimmedMessage = chatInput.trim();
        if (!trimmedMessage) return;

        setChatInput("");

        await handleSendMessage({
            message: trimmedMessage,
            chatId: chatId
        });
        // await handleOpenChat(chatId);
    }

    return (
        <section className='bg-black text-gray-200 h-screen w-full'>
            <div className="main w-full h-screen flex px-2 py-1 gap-1">
                <Sidebar />

                <div className="h-full w-full flex-1 flex flex-col chatlist ">

                    {/* NAV */}
                    <div className="nav w-full flex px-4 py-6 justify-between border-b border-gray-800">
                        <h1 className='font-semibold text-2xl'>Perplexity</h1>
                        <h4 className='text-3xl font-medium cursor-pointer '><MdGroupAdd /></h4>
                    </div>

                    {/* CHAT BODY */}
                    <div className="flex-1 overflow-y-auto px-10 py-4 flex flex-col gap-5">

                        {messages.map((msg, idx) => {

                            // const formattedContent =
                            //     msg.content?.replace(/\n/g, "\n\n");

                            const formattedContent = formatMarkdown(msg.content);

                            return (
                                <div
                                    key={idx}
                                    className={`flex w-full ${msg.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[65%] px-5 py-4 rounded-2xl text-sm leading-7 ${msg.role === "user"
                                            ? "bg-gray-800 text-white rounded-br-md"
                                            : " text-gray-200 rounded-bl-md"
                                            }`}
                                    >
                                        {msg.role === "ai"
                                            ? <MarkdownMessage content={formattedContent} />
                                            : <p>{msg.content}</p>
                                        }
                                    </div>
                                </div>
                            );
                        })}

                        <div ref={chatEndRef} />
                    </div>

                    {/* INPUT */}
                    <div className="w-full px-10 py-4 border-t border-gray-800">

                        <div className="search w-full flex items-center px-4 py-2 bg-gray-800 rounded-3xl">

                            <textarea
                                rows={1}
                                onInput={handleInput}
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask anything..."
                                className='w-full bg-transparent px-2 outline-0 py-2 resize-none overflow-hidden max-h-40'
                            />

                            <button
                                onClick={handleSubmit}
                                className='px-4 ml-2 rounded-md py-2 hover:bg-blue-600'
                            >
                                Send
                            </button>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default ChatPage;