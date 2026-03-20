import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from 'langchain';
import { searchContent } from "./search.service.js";
import * as z from "zod";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-flash-latest",
  temperature: 0,
  apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: process.env.MISTRAL_API_KEY
});

// const emailTool = tool(
//     sendEmail,
//     {
//         name: "emailTool",
//         description: "Use this tool to send an email",
//         schema: z.object({
//             to: z.string().describe("The recipient's email address"),
//             html: z.string().describe("The HTML content of the email"),
//             subject: z.string().describe("The subject of the email"),
//         })
//     }
// )

const searchInternet = tool(
  searchContent,
  {
    name: "searchInternet",
    description:
      "Use this tool to search the internet for up-to-date information.",
    schema: z.object({
      query: z.string().describe("The search query to look up on the internet.")
    })
  }
)


const agent = createAgent({
  model: geminiModel,
  tools: [searchInternet],
})


export async function generateResponce(messages) {
  const response = await agent.invoke({
    messages: [
      new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
            `),
      ...(messages.map(msg => {
        if (msg.role == "user") {
          return new HumanMessage(msg.content)
        } else if (msg.role == "ai") {
          return new AIMessage(msg.content)
        }
      }))
    ]
  })
  return response.messages[ response.messages.length - 1 ].text;
}

export async function generateChatTitle(message) {
  console.log("Generate Title hit " + message);
  const responce = await mistralModel.invoke([
    new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),
    new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            ${message}
            `)
  ])
  console.log(responce.text);
  return responce.text;
}
