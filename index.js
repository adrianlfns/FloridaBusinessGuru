
import { HuggingFaceInference } from "@langchain/community/llms/hf";


const model = new HuggingFaceInference({
  temperature:0.8,
  model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  apiKey: process.env.HUGGINFACE__API_KEY
});

const res = await model.invoke("Can you list 5 business names for a a construction company?");



//console.log({ res });


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
