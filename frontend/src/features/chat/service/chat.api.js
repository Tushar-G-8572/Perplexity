import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:4000/api/chats",
    withCredentials:true
})

export async function sendMessage({message,chatId}) {
    const responce = await api.post('/message',{message,chatId});
    return responce.data
}

export async function getChats() {
    const responce = await api.get('/');
    return responce.data
}

export async function getMessages(chatId) {
    const responce = await api.get(`${chatId}/messages`);
    return responce.data
}

export async function deleteChats(chatId) {
    const responce = await api.delete(`/delete/${chatId}`);
    return responce.data
}