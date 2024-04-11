var emailInput = document.getElementById("emailInput");
var passwordInput = document.getElementById("passwordInput");
var confirmPasswordInput = document.getElementById("confirmPasswordInput");
// var isFormSubmitted = false;

document.addEventListener("DOMContentLoaded", function() {
  var registerButton = document.getElementById("registerButton");

  registerButton.addEventListener("click", function(event) {
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

//////de continuat undeva aici

// event listener pentru cardurile de la categorii
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", function (event) {
    event.preventDefault();

    const targetId = this.getAttribute("href").substring(1);

    document.getElementById(targetId).scrollIntoView({
      behavior: "smooth",
      block: "start", //aliniere
    });

    // Add a class to the target section to indicate it's selected
    document.querySelectorAll("section").forEach((section) => {
      section.classList.remove("section-selected"); // Remove the class from all sections
    });
    document.getElementById(targetId).classList.add("section-selected"); // Add the class to the target section
  });
});

// event listener pentru logo, te duce in susul paginii --------------------------- vezi ca nu mai merge 
const logo = document.querySelector(".logo");
logo.addEventListener("click", function (event) {
  event.preventDefault();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// afisarea numerelor de pe price filter
const rangeInput = document.getElementById("price-filter");
const minValueSpan = document.getElementById("min-value");
const maxValueSpan = document.getElementById("max-value");

minValueSpan.textContent = rangeInput.min;
maxValueSpan.textContent = rangeInput.max;

rangeInput.addEventListener("input", function () {
  minValueSpan.textContent = this.value;
});
