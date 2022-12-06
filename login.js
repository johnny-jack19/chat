const url = "http://localhost:3000";
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInfo),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data[0]);
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
