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
        body: JSON.stringify({ email, password }), // Send data as JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(' Wrong credentials. Please try again.');
        }
        return response.json();
    })
    .then(result => {
        alert("User logged in successfully !!!", result.token);
        localStorage.setItem("token", result.token); // Save the token in localStorage
        window.location.href = window.location.origin + "/menu";
        // if (localStorage.getItem('token')) {
        //     window.location.href = window.location.origin + '/menu';
        //   }
    })
    .catch(error => {
        console.error('An error occurred:', error);
        alert('An error occurred.' + error.message);
    });
  });
