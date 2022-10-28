let messages = [];
let tempArray = [];
let userName = "";
let reponse = null
const messageList = document.querySelector('.main_body');

function registerName(){
    userName = prompt("Qual é seu nome de usuário?");
    const data ={
        name: userName
    };
    const promisseName = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', data);
    promisseName.then(getMessage);
    promisseName.catch(registerName)

    setInterval(() => {
        const promisseName = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', data);
        }, 5000);
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
    const message = document.querySelector("input").value;
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