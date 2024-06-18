document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    //validating form data and sending it to the server
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    fetch("/loginAdmin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Send data as JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(' Wrong credentials. Please try again.');
        }
        return response.json();
    })
    .then(result => {
        console.log('Success:', result);
        localStorage.setItem('token', result.token); // Save the token in localStorage
        alert("Admin logged in successfully !!!", result.token);
        window.location.href = window.location.origin + "/menu";
    })
    .catch(error => {
        console.error('An error occurred in login admin script:', error);
        alert('An error occurred in login admin script. ' + error.message);
    });
  });
