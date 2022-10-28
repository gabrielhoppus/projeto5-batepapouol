let messages = [];
const messageList = document.querySelector('.main_body');

function userName(){
    const name = prompt("Qual é seu nome de usuário?");
    const data ={
        name: name
    };
    const promisseName = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', data);
    promisseName.then(getMessage);
    promisseName.catch(userName)

    setInterval(() => {
        const promisseName = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', data);
        }, 5000);
}

function getMessage(){
    const promisseMessage = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promisseMessage.then(promisseOK);
    promisseMessage.catch(promisseError)
    setInterval(() => {
        const promisseMessage = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
        promisseMessage.then(promisseOK);
        promisseMessage.catch(promisseError)
    }, 3000);
}

function promisseError(){
    alert("Error!!!")
}

function promisseOK(response){
    messages = response.data;
    renderMessages();
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
            messageList.innerHTML += `
            <div class="private_message">
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

function scrollLast(){
    messageList.lastElementChild.scrollIntoView()
}