import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import {HumanMessage,SystemMessage,AIMessage} from 'langchain';

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({  
  model: "mistral-small-latest",
  apiKey:process.env.MISTRAL_API_KEY
});

export async function generateResponce(messages){
  const responce = await geminiModel.invoke(messages.map((msg)=>{
    if(msg.role === 'user'){
      return new HumanMessage(msg.content)
    }
    else if(msg.role === 'ai'){
      return new AIMessage(msg.content);
    }
  }));
  return responce.text
}

export async function generateChatTitle(message){
  const responce  = await mistralModel.invoke([
      new SystemMessage(`You are a helpful assistant that generates a concise title for a chat conversation.

        user Will provide you with the first message of the conversation, and you will generate a title that captures the essence of the discussion in 3 to 5 words. The title should be clear, relevant, and engaging, giving a quick insight into the topic of the conversation.
         `),

         new HumanMessage(`
          Generate a title for a chat conversation based on the following message: "${message}"
          `)
  ])

  return responce.text;
}

// export async function testAI() {
//     const response = await model.invoke("What is the capital of India");
        
//     console.log(response.text);
// }

// export async function testMistralAI() {
//   try {
//     const res = await mistralModel.invoke(
//       "What is the capital of INDIA "
//     );

//     console.log(res.content);

//   } catch (err) {
//     console.log(err);
//   }
// }