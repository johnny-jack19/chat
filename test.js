const url = "http://localhost:3000";

function getChat(store) {
  fetch(url + "/sample", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      for (message of data.results) {
        store.push(message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function testTable() {
  fetch(url + `/test`, {
    method: "POST",
    mode: "cors",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function makeMessage(message) {
  fetch(url + `/message/chat_1_2`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

let chatData = [];
const myChat = document.getElementById("my-chat");

function getClick() {
  getChat(chatData);
}

function displayClick() {
  myChat.innerHTML = "";
  for (let i = 0; i < chatData.length; i++) {
    myChat.innerHTML += `
        <p class="user_${chatData[i]["user_id"]}">${chatData[i].message}</p>
        `;
  }
}

let myMessage = {
  user_id: 1,
  message: "You tell me!",
};

function buttonTable() {
  testTable();
}

function clickMessage() {
  makeMessage(myMessage);
}
