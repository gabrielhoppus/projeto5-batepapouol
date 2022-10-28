let messages = [];
let tempArray = [];
let userName = "";
let reponse = null
const messageList = document.querySelector('.main_body');

function registerName(){
    userName = document.querySelector(".login_input").value;
    const data ={
        name: userName
    };
    const promisseName = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', data);
    promisseName.then(getMessage);
    promisseName.catch(promisseNameError)

    const login = document.querySelector(".login_input")
    const button = document.querySelector("button")
    const loading = document.querySelector(".loading_gif")
    const loginScreen = document.querySelector(".login_screen")
    const chat = document.querySelector(".chat_container")

    login.classList.add("hidden")
    button.classList.add("hidden")
    loading.classList.remove("hidden")

    setTimeout(() =>{
        loginScreen.classList.add("hidden")
        chat.classList.remove("hidden")
        loading.classList.add("hidden")
    },3000)
    
    setInterval(() => {
        const promisseName = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', data);
        }, 5000);
}

function promisseNameError(){
    alert("Esse nome já está sendo usado")
    window.location.reload()
}

function getMessage(){
    const promisseChat = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promisseChat.then(promisseOK);
    promisseChat.catch(promisseError)
    setInterval(() => {
        const promisseChat = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
        promisseChat.then(checkNew);
        promisseChat.catch(promisseError)
    }, 3000);
}

function promisseError(){
    alert("Error!!!")
}

function promisseOK(response){
    messages = response.data;
    renderMessages();
    scrollLast();
}


function renderMessages(){
    messageList.innerHTML = '';
    for (let i = 0; i < messages.length; i++){
        let message = messages[i];        
        if(message.type === "status"){
            messageList.innerHTML += `
            <div class="status_message">
                <p class="message">
                    <span class="time">(${message.time})</span>
                    <strong class="from">${message.from}</strong>
                    <span class="text">${message.text}</span>
                </p>
            </div>
            `
        }else if (message.type === "message"){
            messageList.innerHTML += `
            <div class="public_message">
                <p class="message">
                    <span class="time">(${message.time})</span>
                    <strong class="from">${message.from}</strong>
                    <span>para</span>
                    <strong class="to">${message.to}:</strong>
                    <span class="text">${message.text}</span>
                </p>  
            </div>
            `
        }else if(message.type === "private_message"){
            if (message.to === userName){
                messageList.innerHTML += 
                `<div class="private_message">
                    <p class="message">
                        <span class="time">(${message.time})</span>
                        <strong class="from">${message.from}</strong>
                        <span>reservadamente para</span>
                        <strong class="to">${message.to}:</strong>
                        <span class="text">${message.text}</span>   
                    </p>             
                </div>
            `
            }
            }            
        }
    }


function checkNew(response){
    tempArray = response.data
    if (arrayEquals(messages, tempArray) == true){
        return;
    }else{
        messages = tempArray
        renderMessages()
        scrollLast()
    }
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function scrollLast(){
    messageList.lastElementChild.scrollIntoView()
}


function sendMessage(){
    const message = document.querySelector("input_message").value;
    const msg ={
        from: userName,
        to: "Todos",
        text: message,
        type: "message" // ou "private_message" para o bônus
    };
    const promisseMessage = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msg);
    promisseMessage.then(promisseMessageOK)
    promisseMessage.catch(promisseMessageError)
}

function promisseMessageOK(){
    getMessage();
    document.querySelector("input").value = ""
}

function promisseMessageError(){
    window.location.reload()
}   

function sendEnter(){
const input = document.querySelector("input")
input.addEventListener("keypress", function(event){
    if (event.key === "Enter"){
        document.querySelector(".plane").click();
    }
})
}