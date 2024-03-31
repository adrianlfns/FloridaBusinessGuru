import {answerQuestion, InnitRetriever} from './index.js'



var oQuestionText = document.getElementById("txtQuestion");
var oQuestionBtn = document.getElementById("cmdQuestionSubmit");
var oChatList = document.getElementById("chatList");
   
function ScrollToBottom(){
  const scrollingElement = (document.scrollingElement || document.body);
  scrollingElement.scrollTop = scrollingElement.scrollHeight; 
}

export async function InnitializeRetriever(){
  return await InnitRetriever();
}

export function SetSubmitQuestionDisabled(){ 
  oQuestionText.setAttribute("disabled", true);
  oQuestionText.setAttribute("editable", false); 
  oQuestionBtn.setAttribute("disabled", true);
}

export function SetSubmitQuestionEnabled(){ 
  oQuestionText.removeAttribute("disabled");
  oQuestionText.setAttribute("editable", true);
  oQuestionBtn.removeAttribute("disabled");
}

export function ShowLoader(){
  var oLoaderIndicatro =  document.getElementById("loaderIndicator");
  oLoaderIndicatro.style.display = "";
}

export function HideLoader(){
  var oLoaderIndicatro =  document.getElementById("loaderIndicator");
  oLoaderIndicatro.style.display= "none";
}

window.HideLoader = HideLoader;
window.SetSubmitQuestionEnabled = SetSubmitQuestionEnabled;

function AppendBotMessage(strAnwwer){

  var botHtmlMessage = document.createElement("li");
  botHtmlMessage.className = "mb-2 text-primary";
    var strMessage = `<div class="card"> 
        <div class="card-body">
          <p class="fw-bold mb-0 text-primary">FL Guru Bot</p> 
          <p class="mb-0 text-primary">
            ${strAnwwer}
          </p>
        </div>
      </div>`;     
      botHtmlMessage.innerHTML =strMessage;
      oChatList.append(botHtmlMessage);
}

function AppendHumanMessage(strQuestion) {
  var humanHtmlMessage = document.createElement("li");
    humanHtmlMessage.className = "mb-2";
    var strMessage = `<div class="card"> 
        <div class="card-body">
          <p class="fw-bold mb-0">You</p> 
          <p class="mb-0">
            ${strQuestion}
          </p>
        </div>
      </div>`;     
      humanHtmlMessage.innerHTML =strMessage;
      oChatList.append(humanHtmlMessage);
}

async function SubmitQuery(){
  try{ 
    var strQuestion = oQuestionText.value;
    if(strQuestion == "") return;
    SetSubmitQuestionDisabled();
    ShowLoader();                  
    AppendHumanMessage(strQuestion);
    ScrollToBottom(); 
    var strAnswer = await answerQuestion(strQuestion);              
    AppendBotMessage(strAnswer);
    ScrollToBottom();

    
  }catch (error) {
    console.error(error); 
  }
  finally
  {
    oQuestionText.value = "";
    SetSubmitQuestionEnabled();
    HideLoader();
    oQuestionText.focus();
  }               
}

oQuestionText.addEventListener("keyup", function(e){
  //validates that there is text 
  if (oQuestionText.value.trim() == "")
  {
    oQuestionBtn.setAttribute("disabled", true);
  }
  else
  {
    oQuestionBtn.removeAttribute("disabled");
  }                
});

oQuestionText.addEventListener("keypress", function(e){
  if (oQuestionText.value == "")
  {
    oQuestionBtn.setAttribute("disabled", true);
  }
  else
  {
    oQuestionBtn.removeAttribute("disabled");
  }
  if(e.key === 'Enter'){
     e.preventDefault();  
     SubmitQuery();  
  }
});

oQuestionBtn.addEventListener("click",function(e){
  SubmitQuery();
})

