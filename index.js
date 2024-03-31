
//see https://js.langchain.com/docs/use_cases/chatbots/quickstart
//see https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2

import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { HumanMessage, AIMessage  } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"; 
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

  /////////////context load//////////////////// 
  var retriever = null;

  export async  function InnitRetriever(){

    const loader = new CheerioWebBaseLoader(
      "https://raw.githubusercontent.com/adrianlfns/FloridaBusinessGuru/main/context.txt"          
    );
    const rawDocs = await loader.load(); 
   const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 0,
    });
    const allSplits = await textSplitter.splitDocuments(rawDocs);
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINFACE__API_KEY, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
    });

   // const embeddings = new TensorFlowEmbeddings();
    const vectorstore = await MemoryVectorStore.fromDocuments(
      allSplits,   embeddings
    );
     retriever = vectorstore.asRetriever(4);
    return 1;
  

   /* (async() =>{
    const loader = new CheerioWebBaseLoader(
      "https://raw.githubusercontent.com/adrianlfns/FloridaBusinessGuru/main/context.txt"          
    );
    const rawDocs = await loader.load(); 
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkOverlap: 0,
    });
    const allSplits = await textSplitter.splitDocuments(rawDocs);
    const embeddings = new TensorFlowEmbeddings();
    const vectorstore = await MemoryVectorStore.fromDocuments(
      allSplits ,   embeddings
    );
    retriever = vectorstore.asRetriever(4);
    alert("done");
  })();*/
};



//////////////////History definition////////////
const msgHistory = new ChatMessageHistory(); 
const encapsulatePromptOnInstBrakets = true;


///////////////////Model definition
var documentChain = null;
async function GetDocumentChain(){
  if(documentChain === null)
  {
    const model = new HuggingFaceInference({ 
       model: "mistralai/Mistral-7B-Instruct-v0.2",
      //model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      //model: "google/gemma-7b",
      //  model: "meta-llama/Llama-2-70b-chat-hf",
      //model: "openchat/openchat-3.5-0106",
      //model: "codellama/CodeLlama-70b-Instruct-hf", 
      apiKey: process.env.HUGGINFACE__API_KEY
    });
    
    
    ////////////promp template//////////////
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a helpful assistant that can help entrepreneurs to establish a new business in Miami-Dade, Florida. 
         Do not use any prefixes your answer. 
         Do not format the URLs in the answer. 
         Answer the user's questions based on the context below:\n\n{context}`,
      ],
      new MessagesPlaceholder("messages"),
    ]);

    documentChain = await createStuffDocumentsChain({
      llm: model,
      prompt: prompt ,
    });
  }
  return documentChain;
}



 

/////////////chain//////////////////
//const chain = prompt.pipe(model);



export async function answerQuestion(question){ 
  const docs = await retriever.invoke(question);
  console.log(docs);

   var docChain = await GetDocumentChain();
   if(docChain == null)
   {
    alert("Unable to obtain the document chain");
    return;
   }

   
   if(encapsulatePromptOnInstBrakets)
   {
     question = "[INST]" + question + "[/INST]";
   }
   
  await msgHistory.addMessage(new HumanMessage(question));
  const answer = await docChain.invoke({
    messages: await msgHistory.getMessages(),
    context: docs
  }); 
  await msgHistory.addMessage(new AIMessage(answer)); 
  return answer;
};



 /*


const embeddings = new TensorFlowEmbeddings();
*/

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
