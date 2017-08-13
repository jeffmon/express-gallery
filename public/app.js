const userLogin = document.getElementById("user-login");
const userNew = document.getElementById("user-new");

const username = document.getElementById("username");
const password = document.getElementById("password");

var test;


const post = (url, user, pass) => {
  var params = `username=${user}&password=${pass}`;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(params);
}

if(userLogin){
  window.addEventListener("load", function() {

    userLogin.addEventListener("click", () => {
      post("/login", username.value, password.value);
    }, false)

    userNew.addEventListener("click", () => {
      post("/login/new", username.value, password.value);
    }, false)
  })
}
