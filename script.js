var emailInput = document.getElementById("emailInput");
var passwordInput = document.getElementById("passwordInput");
var confirmPasswordInput = document.getElementById("confirmPasswordInput");
// var isFormSubmitted = false;

document.addEventListener("DOMContentLoaded", function () {
  var registerButton = document.getElementById("registerButton");

  registerButton.addEventListener("click", function (event) {
    var email = emailInput.value;
    var password = passwordInput.value;
    var confirmPassword = confirmPasswordInput.value;
    if (email && email.includes("@") && email.includes(".")) {
      if (password == confirmPassword) {
        closePopup();
      } else {
        alert("Passwords do not match.");
        event.preventDefault();
      }
    } else {
      alert("Please enter a valid email address.");
      event.preventDefault();
    }
  });
});

joinButton.addEventListener("click", function (event) {
  var email = emailInput.value;
  if (email && email.includes("@") && email.includes(".")) {
    closePopup();
  } else {
    alert("Please enter a valid email address.");
    event.preventDefault();
  }
  //aici mai poate fi adaugat pe parcurs mesaj cu nu ai cont -> mergi la register
});
