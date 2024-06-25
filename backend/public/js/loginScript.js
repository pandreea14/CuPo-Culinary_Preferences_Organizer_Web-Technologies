import { redirectIfAuthenticated, setCookie } from './tokenScript.js';

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    //validating form data and sending it to the server
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(' Wrong credentials. Please try again.');
        }
        return response.json();
    })
    .then(result => {
        console.log('Success:', result);
        if (result.token) {
            localStorage.setItem('token', result.token);
            redirectIfAuthenticated();
          } else {
            alert('Login failed');
          }
        alert("User logged in successfully !!!", result.token);
    })
    .catch(error => {
        console.error('An error occurred in login script:', error);
        alert(error.message);
    });
  });