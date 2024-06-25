document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    //validating form data and sending it to the server
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const confirmPassword = document.getElementById("confirmPasswordInput").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
        const response = await fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }), // Send data as JSON
        });
  
        const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      alert("Registration successful, now login");
      window.location.href = window.location.origin + "/login";
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred: ' + error.message); // Display the error as an alert
    }
  });
