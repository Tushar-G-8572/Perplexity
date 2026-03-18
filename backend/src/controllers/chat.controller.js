import { generateResponce,generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";


export async function chatMessageController(req,res) {

    const {message,chatId:chatId} = req.body;
    const userId = req.user.id;
    let aiTitle= null,chat = null
    if(!chatId){
        aiTitle = await generateChatTitle(message);
        chat = await chatModel.create({
            user:userId,
            title:aiTitle
        })
    }

     const userMessage = await messageModel.create({
        chat:chatId || chat._id,
        content:message,
        role:'user'
    })

    const messages = await messageModel.find({chat:chatId || chat._id})
    // console.log(messages)
        
    const aiResponce = await generateResponce(messages);

    const aiMessage = await messageModel.create({
        chat:chatId || chat._id,
        content:aiResponce,
        role:'ai'
    })

    res.status(201).json({
        aiTitle,
        chat,
        aiMessage
    });

}

export async function getAllChatsController(req,res) {
    try{
        const userId = req.user.id;
        
        const chats = await chatModel.find({user:userId});

        return res.status(200).json({message:"all chats feteched Successfully",
            chats
        })
        
    }catch(err){
        console.log(err);
        return res.status(400).json({message:"error while fetching messages"});
    }

}

export async function getUserMessageController(req,res) {
    try{

        const userId = req.user.id;
        const chatId = req.params.chatId;
        
        const chats = await chatModel.findOne({
            _id:chatId,
            user:userId
        })
        
        if(!chats) return res.status(404).json({message:"Chat not found"})
            
            const messages = await messageModel.find({
                chat:chatId
            })
            
            return res.status(200).json({message:"Messages feteched ",
                messages
            })
        }catch(err){
            console.log(err);
            return res.status(400).json({message:"error while fetching messages"});
        }
}

export async function deleteChatController(req,res) {
    try{

        const userId = req.user.id;
        const chatId = req.params.chatId;
        
        const chats = await chatModel.findOneAndDelete({user:userId,_id:chatId});
        
        if(!chats) return res.status(404).json({message:"No chats found"});
        
        await messageModel.deleteMany({
            chat:chatId
        })
        
        return res.status(200).json({message:"Chat deleted"})
    }catch(err){
        console.log(err);
        return res.status(400).json({message:"Error while deleting messages"});
    }
}