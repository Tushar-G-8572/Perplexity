import { initializeSocketConnection } from "../service/chat.socket";
import { useDispatch } from "react-redux";
import {getChats,getMessages,deleteChats,sendMessage} from '../service/chat.api.js'
import { setError,setLoading,setChats,setCurrentChatId } from "../chat.slice";

export const useChat = ()=>{

    const dispath = useDispatch();


    async function handleSendMessage({message,chatId}) {
        try{
            dispath(setLoading(true))
            const data = await sendMessage({message,chatId});
            const {aiMessage,chat} = data;
            dispath(setChats((prev)=>{
                return {
                    ...prev,
                    [chat._id]:{
                        ...chat,
                        messages: [{content:message,role:"user"},aiMessage]
                    }
                }
            }))
            dispath(setCurrentChatId(chat._id))
        }catch(err){
            dispath(setError(err))
        }finally{
            dispath(setLoading(false));
        }

    }


    return {
        initializeSocketConnection,
        handleSendMessage
    }
}