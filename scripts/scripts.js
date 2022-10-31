let messages = [];
let tempArray = [];
let userName = "";
let users = [];
let messageList = document.querySelector('.main_body');
let selectedName = ""
let type = ""

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

function showUsers(){
    const userPanel = document.querySelector(".user_list_container");
    userPanel.classList.remove("hidden");
    getUsers();
}

function hideUsers(){
    const userPanel = document.querySelector(".user_list_container");
    userPanel.classList.add("hidden");
}

function getUsers(){
    const promisseUsers = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promisseUsers.then(promisseUsersOK);
    promisseUsers.catch(promisseError)
    setInterval(() => {
        const promisseUsers = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
        promisseUsers.then(promisseUsersOK);
        promisseUsers.catch(promisseError)
    }, 1000000);
}

function promisseUsersOK(responseUsers){
    users = responseUsers.data;
    renderUsers();
}

function renderUsers(){
    const userList = document.querySelector('.chat_users')
    userList.innerHTML = '';
    userList.innerHTML += `
    <div onclick="selectUser(this)" class="chat_user_container">
        <img src="./assets/people.png">
        <h1 class="user_name">Todos</h1>
        <img class="checkmark" src="./assets/checkmark.png">
    </div>    
    `
    for (let i = 0; i < users.length; i++){
        let user = users[i];
        userList.innerHTML += `
        <div onclick="selectUser(this)" class="chat_user_container">
            <img src="./assets/person-circle.png">
            <h1 class="user_name">${user.name}</h1>
            <img class="checkmark" src="./assets/checkmark.png">
        </div>    
        `
    }
}

function selectUser(user){
    const selected_user = document.querySelector(".selected_user");

    if (selected_user !== null){
        selected_user.classList.remove("selected_user")
    }
    user.classList.add("selected_user"); 
    selectedName = document.querySelector(".selected_user>.user_name").innerHTML;  
}

function selectMessage(message){
    const selected_message = document.querySelector(".selected_message");

    if (selected_message !== null){
        selected_message.classList.remove("selected_message")
    }
    message.classList.add("selected_message"); 
    let messageType = document.querySelector(".selected_message>.message_visibility").innerHTML;
    if (messageType === "Público"){
        type = "message";
        spanType = "publicamente"
    }else if (messageType === "Reservadamente"){
        type = "private_message"
        spanType = "reservadamente"
    }
}

function userTypeMessage(){
    let targetUser = document.querySelector(".selected_user>.user_name").innerHTML
    let spanType = document.querySelector(".selected_message>.message_visibility").innerHTML
    let messageSpan = document.querySelector(".span_message").innerHTML
    if (selectedName !== "" || type !== ""){
        messageSpan = ''
        messageSpan = `<span>Enviando para ${targetUser} (${spanType})</span>`
    }
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
            if (message.to === userName || message.from === userName){
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
    if (arrayEquals(messages, tempArray) === true){
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
    const message = document.querySelector(".input_message").value;
    if (selectedName === ""){
        selectedName = "Todos"
    }
    if (type === ""){
        type = "message"
    }
    const msg ={
        from: userName,
        to: selectedName,
        text: message,
        type: type
    };
    const promisseMessage = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msg);
    promisseMessage.then(promisseMessageOK)
    promisseMessage.catch(promisseMessageError)
}

function promisseMessageOK(){
    getMessage();
    document.querySelector(".input_message").value = ""
}

function promisseMessageError(){
    window.location.reload()
}   

function sendEnter(){
const input = document.querySelector(".input_message")
input.addEventListener("keypress", function(event){
    if (event.key === "Enter"){
        document.querySelector(".plane").click();
    }
})
}