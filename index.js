
//see https://js.langchain.com/docs/use_cases/chatbots/quickstart
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { HumanMessage, AIMessage  } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";

const msgHistory = new ChatMessageHistory(); 


//Model definition
const model = new HuggingFaceInference({ 
  //temperature: 1,
  model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
//  model: "meta-llama/Llama-2-70b-chat-hf",
 // model: "openchat/openchat-3.5-0106",
  //model: "codellama/CodeLlama-70b-Instruct-hf", 
  apiKey: process.env.HUGGINFACE__API_KEY
});


//promp template
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant that can help entrepreneurs to establish a new business in Miami-Dade, Florida.  . Answer all questions to the best of your ability.",
  ],
  new MessagesPlaceholder("messages"),
]);


//chain
const chain = prompt.pipe(model);



export async function answerQuestion(question){ 
  await msgHistory.addMessage(new HumanMessage(question));
  const answer = await chain.invoke({
    messages: await msgHistory.getMessages()
  }); 
  await msgHistory.addMessage(new AIMessage(answer)); 
  return answer;
};
 


/*
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'


try
{
    const result = await fetch('test.txt')
    const text = await  result.text()

    const splitter = new RecursiveCharacterTextSplitter({
        separators:['\n']
        })

    const output = await splitter.createDocuments([text])
    console.log(output)    
}
catch(err){    
   console.log(err); 
   }*/
