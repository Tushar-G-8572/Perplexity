import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"



const mistralModel = new ChatMistralAI({  
  model: "mistral-small-latest",
});

export async function testMistralAI() {
  try {
    const res = await mistralModel.invoke(
      "What is the capital of INDIA "
    );

    console.log(res.content);

  } catch (err) {
    console.log(err);
  }
}



const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

export async function testAI() {
    const response = await model.invoke("What is the capital of India");
        
    console.log(response.text);
}