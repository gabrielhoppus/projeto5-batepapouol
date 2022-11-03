let messages = [];
let tempArray = [];
let users = [];
let userName = "";
const messageList = document.querySelector('.main_body');
let selectedName = "";
let type = "";
const spanType = ""
const apiUsers = 'https://mock-api.driven.com.br/api/v6/uol/participants';
const apiStatus = 'https://mock-api.driven.com.br/api/v6/uol/status';
const apiMessage = 'https://mock-api.driven.com.br/api/v6/uol/messages';
const threeSeconds = 3000
const tenSeconds = 10000
const fiveSeconds = 5000

/*  Function that:
Ps: Login Screen - Part of Bônus Requirements
1.  get the user name from input
2.  send it to the API the check for duplicates
3.  if true transtions to the loading screen and proceeds to load messages
    if false alerts the user and resets the page */
function registerName(){
    userName = document.querySelector(".login_input").value;
    const data ={
        name: userName
    };
    let promisseName = axios.post(apiUsers, data);
    promisseName.then(getMessage);
    promisseName.catch(promisseNameError);

    const login = document.querySelector(".login_input");
    const button = document.querySelector("button");
    const loading = document.querySelector(".loading_gif");
    const loginScreen = document.querySelector(".login_screen");
    const chat = document.querySelector(".chat_container");

    login.classList.add("hidden");
    button.classList.add("hidden");
    loading.classList.remove("hidden");

    setTimeout(() =>{
        loginScreen.classList.add("hidden")
        chat.classList.remove("hidden")
        loading.classList.add("hidden")
    },threeSeconds);
    
    setInterval(() => {
        promisseName = axios.post(apiStatus, data);
    }, fiveSeconds);
}
/*  Error treatment for user name duplicates */
function promisseNameError(){
    alert("Esse nome já está sendo usado");
    window.location.reload();
}

/*  Function that gets the messages from the API
    If successful it gets the data and proceeds to render it on the screen
    If unsuccessful it alerts the user of the error */
function getMessage(){
    let promisseChat = axios.get(apiMessage);
    promisseChat.then(promisseOK);
    promisseChat.catch(promisseError);
    setInterval(() => {
        promisseChat = axios.get(apiMessage);
        promisseChat.then(getMessage);
        promisseChat.catch(promisseError);
    }, threeSeconds);
}

/*Error treatment for API get error 400 */
function promisseError(){
    alert("Não foi possível carregar as mensagens, tente novamente");
    window.location.reload();
}

/*  Function that stores the message data on a list
    triggers message renderization on screen
    and scrolls to the newest message */
function promisseOK(response){
    messages = response.data;
    renderMessages();
    scrollLast();
}

/*Function that renders messages on screen 
1.  It resets the current message list on the screen
2.  it gets every message on the messages list
    checks it's type
    create the proper div with it's corret characteristics*/
function renderMessages(){
    messageList.innerHTML = '';
    for (let i = 0; i < messages.length; i++){
        const message = messages[i];        
        if(message.type === "status"){
            messageList.innerHTML += `
            <div data-test="message class="status_message">
                <p class="message">
                    <span class="time">(${message.time})</span>
                    <strong class="from">${message.from}</strong>
                    <span class="text">${message.text}</span>
                </p>
            </div>
            `;
        }else if (message.type === "message"){
            messageList.innerHTML += `
            <div data-test="message class="public_message">
                <p class="message">
                    <span class="time">(${message.time})</span>
                    <strong class="from">${message.from}</strong>
                    <span>para</span>
                    <strong class="to">${message.to}:</strong>
                    <span class="text">${message.text}</span>
                </p>  
            </div>
            `;
        }else if(message.type === "private_message"){
            if (message.to === userName || message.from === userName){
                messageList.innerHTML += 
                `<div data-test="message class="private_message">
                    <p class="message">
                        <span class="time">(${message.time})</span>
                        <strong class="from">${message.from}</strong>
                        <span>reservadamente para</span>
                        <strong class="to">${message.to}:</strong>
                        <span class="text">${message.text}</span>   
                    </p>             
                </div>
            `;
            }
            }            
        }
    }

/*Function that scrolls down to the newest message on the screen */
function scrollLast(){
    messageList.lastElementChild.scrollIntoView();
}

/*Function that:
1.  gets the information from the messa ge input box
2.  checks if it is a private or public message
3.  populates the data to send to the api
4.  communicates with the api
    if successful it refreshes the screen with the sent message
    and resets the input box
    if unsuccessful it shows and error message and reloads the application */
function sendMessage(){
    const message = document.querySelector(".input_message").value;
    if (selectedName === ""){
        selectedName = "Todos";
    }
    if (type === ""){
        type = "message";
    }
    const msg ={
        from: userName,
        to: selectedName,
        text: message,
        type: type
    };
    let promisseMessage = axios.post(apiMessage, msg);
    promisseMessage.then(promisseMessageOK);
    promisseMessage.catch(promisseMessageError);
}

/*Function that triggers new messages loading after sending a text message */
function promisseMessageOK(){
    getMessage();
    document.querySelector(".input_message").value = "";
}

/*Error treatment for errors while sending a message */
function promisseMessageError(){
    alert("Não foi possível enviar sua mensagem, tente novamente")
    window.location.reload();
}   

/*BONUS - Send messages pressing Enter
    Function that triggers the send message function when
    users press the Enter key */
function sendEnter(){
    const input = document.querySelector(".input_message");
    input.addEventListener("keypress", function(event){
        if (event.key === "Enter"){
            document.querySelector(".plane").click();
        }
    })
    }


/*BONUS - User Panel and Functionalities (Incomplete)*/

/*Working - Function that triggers the user panel window when clicking the proper icon */
function showUsers(){
    const userPanel = document.querySelector(".user_list_container");
    userPanel.classList.remove("hidden");
    getUsers();
}

/*Working - Function that hides the user panel window on clicking the black screen */
function hideUsers(){
    const userPanel = document.querySelector(".user_list_container");
    userPanel.classList.add("hidden");
}

/*Working
Function that gets the user information from the API
    If the request is successful it proceeds to get the user data
    If the request is unsuccessful it proceeds to show and error */
function getUsers(){
    let promisseUsers = axios.get(apiUsers);
    promisseUsers.then(promisseUsersOK);
    promisseUsers.catch(promisseError);
    setInterval(() => {
        promisseUsers = axios.get(apiUsers);
        promisseUsers.then(promisseUsersOK);
        promisseUsers.catch(promisseError);
    }, tenSeconds);
}

/*Working
    Function that gets the user data and store it in a list
    and triggers the renderization of the users on the screen */
function promisseUsersOK(responseUsers){
    users = responseUsers.data;
    renderUsers();
}

/*Working
    Function that gets the information from the users list and renders
    it on the screen along with the default "Todos" entitity */
function renderUsers(){
    const userList = document.querySelector('.chat_users');
    userList.innerHTML = '';
    userList.innerHTML += `
    <div data-test="all" onclick="selectUser(this)" class="chat_user_container">
        <img src="./assets/people.png">
        <h1 class="user_name">Todos</h1>
        <img data-test="check" class="checkmark" src="./assets/checkmark.png">
    </div>    
    `;
    for (let i = 0; i < users.length; i++){
        const user = users[i];
        userList.innerHTML += `
        <div data-test="participant" onclick="selectUser(this)" class="chat_user_container">
            <img src="./assets/person-circle.png">
            <h1 class="user_name">${user.name}</h1>
            <img data-test="check" class="checkmark" src="./assets/checkmark.png">
        </div>    
        `;
    }
}

/*NOT WORKING
    3 Functions that select the users and messages to sendo messages
    to an specific user in private or public */
function selectUser(user){
    const selectedUser = document.querySelector(".selected_user");

    if (selectedUser !== null){
        selectedUser.classList.remove("selected_user");
    }
    user.classList.add("selected_user");
    selectedName = document.querySelector(".selected_user>.user_name").innerHTML;
}

function selectMessage(message){
    const selectedMessage = document.querySelector(".selected_message");

    if (selectedMessage !== null){
        selectedMessage.classList.remove("selected_message");
    }
    message.classList.add("selected_message");
    const messageType = document.querySelector(".selected_message>.message_visibility").innerHTML;
    if (messageType === "Público"){
        type = "message";
        spanType = "publicamente";
    }else if (messageType === "Reservadamente"){
        type = "private_message";
        spanType = "reservadamente";
    }
}

function userTypeMessage(){
    const targetUser = document.querySelector(".selected_user>.user_name").innerHTML;
    spanType = document.querySelector(".selected_message>.message_visibility").innerHTML;
    const messageSpan = document.querySelector(".span_message").innerHTML;
    if (selectedName !== "" || type !== ""){
        messageSpan = '';
        messageSpan = `<span>Enviando para ${targetUser} (${spanType})</span>`;
    }
}