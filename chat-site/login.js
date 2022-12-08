const url = "http://localhost:3000";

//Show password
const passwordInput = document.getElementById("pass");
function showPassword() {
  const icon = document.getElementById("password-eye");
  if (passwordInput.type === "password") {
    icon.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;
    passwordInput.type = "text";
  } else {
    icon.innerHTML = `<i class="fa-regular fa-eye"></i>`;
    passwordInput.type = "password";
  }
}

function login(loginInfo) {
  fetch(url + `/users/login`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInfo),
  })
    .then((res) => {
      if (res.status === 200) {
        res
          .json()
          .then((data) => {
            sessionStorage.setItem("user", data.user);
            sessionStorage.setItem("session", data.session);
          })
          .then(() => {
            location.assign("http://127.0.0.1:5500/chat-site");
          });
      }
    })
    .then((res) => res.json())
    .then((data) => {
      sessionStorage.setItem("user", data.user);
      sessionStorage.setItem("session", data.session);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const submitButton = document.getElementById("submit-login");

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  submitLogin();
});

function submitLogin() {
  let formData = {
    userName: document.getElementById("userName").value,
    pass: document.getElementById("pass").value,
  };
  document.getElementById("userName").value = "";
  document.getElementById("pass").value = "";
  login(formData);
}
