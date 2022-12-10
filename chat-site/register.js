const url = "http://localhost:3000";

const errorBox = document.getElementById("reg-error");

function register(regInfo) {
  fetch(url + `/users`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(regInfo),
  })
    .then((res) => {
      if (res.status === 201) {
        location.assign("http://127.0.0.1:5500/chat-site");
      } else {
        errorBox.innerHTML = "Invalid user name";
        errorBox.classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const submitButton = document.getElementById("submit-register");

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  submitRegister();
});

const pass = document.getElementById("pass");
const authPass = document.getElementById("auth-pass");
function submitRegister() {
  if (!document.getElementById("userName").value) {
    errorBox.innerHTML = "User name can't be null";
    errorBox.classList.remove("hidden");
    return;
  }
  if (!pass.value) {
    errorBox.innerHTML = "Password can't be null";
    errorBox.classList.remove("hidden");
    return;
  }
  if (pass.value === authPass.value) {
    let formData = {
      userName: document.getElementById("userName").value,
      pass: document.getElementById("pass").value,
    };
    register(formData);
  } else {
    errorBox.innerHTML = "Passwords didn't match";
    errorBox.classList.remove("hidden");
  }
  document.getElementById("userName").value = "";
  document.getElementById("pass").value = "";
  document.getElementById("auth-pass").value = "";
}
