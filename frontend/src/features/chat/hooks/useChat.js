import { initializeSocketConnection } from "../service/chat.socket";
import { useDispatch } from "react-redux";
import { getChats, getMessages, deleteChats, sendMessage } from '../service/chat.api.js'
import { setError, setLoading, setChats, setCurrentChatId, addMessages, addNewMessage, createNewChat } from "../chat.slice";

export const useChat = () => {

    const dispatch = useDispatch();


    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setLoading(true))
            const data = await sendMessage({ message, chatId });
            const { aiMessage, chat } = data;
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title
            }))
            dispatch(addNewMessage({
                chatId: chat._id,
                content: message,
                role: 'user'
            }))
            dispatch(addNewMessage({
                chatId: chat._id,
                content: aiMessage.content,
                role: aiMessage.role,
            }))
            dispatch(setCurrentChatId(chat._id))
        } catch (err) {
            dispatch(setError(err))
        } finally {
            dispatch(setLoading(false));
        }

    }

    async function handleOpenChat(chatId) {

        const data = await getMessages(chatId)
        const { messages } = data

        const formattedMessages = messages.map(msg => ({
            content: msg.content,
            role: msg.role,
        }))
        dispatch(addMessages({
            chatId,
            messages: formattedMessages,
        }))
        dispatch(setCurrentChatId(chatId))
    }


    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

   async function handleNewChat(){
        dispatch(setLoading(true))
        dispatch(setCurrentChatId(null))
        dispatch(setLoading(false));
    }


    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleNewChat
    }
}