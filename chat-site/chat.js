const url = "http://localhost:3000";
const loginPage = "http://127.0.0.1:5500/chat-site/login.html";

//****************************Fetchs****************************************************
//Get users
function getUsers() {
  fetch(url + "/userlist", {
    method: "GET",
    headers: makeHeaders(),
  })
    .then((res) => {
      if (res.status === 401) {
        location.assign(loginPage);
      }
      res.json().then((data) => {
        usersData = data.results;
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//Get chat
function getChat(user, friend) {
  fetch(url + "/" + user + "/" + friend, {
    method: "GET",
    headers: makeHeaders(),
  })
    .then((res) => {
      if (res.status === 401) {
        location.assign(loginPage);
      }
      res.json().then((data) => {
        chatData = data.results;
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//Send messages
function sendMessage(message) {
  fetch(
    url + `/message/${sessionStorage.getItem("user")}/${currentChatSelected}`,
    {
      method: "POST",
      mode: "cors",
      headers: makeHeaders(),
      body: JSON.stringify(message),
    }
  )
    .then((res) => {
      if (res.status === 401) {
        location.assign(loginPage);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//For auth headers
function makeHeaders() {
  return {
    user: sessionStorage.getItem("user"),
    session: sessionStorage.getItem("session"),
    "Content-Type": "application/json",
  };
}
//*********************************Functionality*************************
//Varibles
let chatData = [];
let usersData = [];
let currentChatSelected;
const chatBox = document.getElementById("chat-box");
const userList = document.getElementById("user-list");
const messageText = document.getElementById("message-text");
//const messageButton = document.getElementById("submit-message");

//**************On load************************
window.onload = () => {
  startUp();
};

function startUp() {
  getUsers();
  setTimeout(() => {
    showUsers();
  }, 1000);
  setTimeout(() => {
    if (userList.innerHTML === "") {
      startUp();
    }
  }, 1000);
}

function showUsers() {
  userList.innerHTML = "";
  for (let i = 0; i < usersData.length; i++) {
    userList.innerHTML += `
        <div id="${usersData[i]["user_id"]}" class="user-div">${usersData[i]["user_name"]}</div>
        `;
  }
  document.querySelectorAll(".user-div").forEach((userDiv) => {
    userDiv.addEventListener("click", (e) => {
      if (currentChatSelected) {
        let selectedUser = document.getElementById(currentChatSelected);
        selectedUser.classList.remove("selected");
      }
      toggleUsersOff();
      currentChatSelected = userDiv.id;
      messageText.value = "";
      let selectedUser = document.getElementById(currentChatSelected);
      selectedUser.classList.add("selected");
      getChat(sessionStorage.getItem("user"), currentChatSelected);
      setTimeout(() => {
        displayChat();
        scrollToBottom();
      }, 1000);
    });
  });
}

//***************Chat********************
//Shows current chat
function displayChat() {
  chatBox.innerHTML = "";
  for (let i = 0; i < chatData.length; i++) {
    chatBox.innerHTML += `
      ${addIcon(chatData[i]["user_id"])}
        <p class="${sortChat(chatData[i]["user_id"])} chat-text">${
      chatData[i].message
    }</p><p></p>
        `;
  }
}

//Helper for display chat
function sortChat(userID) {
  if (userID == sessionStorage.getItem("user")) {
    return "my-chat";
  } else {
    return "friend-chat";
  }
}

//Adds bubble with first letter of name to chat
function addIcon(userID) {
  if (userID == sessionStorage.getItem("user")) {
    return ``;
  } else {
    return `<span class="friend-icon">${
      document.getElementById(currentChatSelected).innerHTML[0]
    }</span>`;
  }
}

//***********Messages*********
function makeMessage() {
  const message = {
    user_id: sessionStorage.getItem("user"),
    message: messageText.value,
  };
  messageText.value = "";
  sendMessage(message);
  chatBox.innerHTML += `
  <p class="my-chat chat-text">${message.message}</p>
  `;
  scrollToBottom();
}

messageText.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    makeMessage();
  }
});

setInterval(() => {
  if (currentChatSelected) {
    const newMessage = chatData.length;
    getChat(sessionStorage.getItem("user"), currentChatSelected);
    setTimeout(() => {
      displayChat();
      if (chatData.length > newMessage) {
        scrollToBottom();
      }
    }, 1000);
  }
}, 15000);

const chatContainer = document.getElementById("chat-container");
function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function logout() {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("session");
  location.reload();
}

function toggleUsersOn() {
  userList.classList.remove("mobile-hidden");
  chatContainer.classList.add("mobile-hidden");
}

function toggleUsersOff() {
  userList.classList.add("mobile-hidden");
  chatContainer.classList.remove("mobile-hidden");
}
