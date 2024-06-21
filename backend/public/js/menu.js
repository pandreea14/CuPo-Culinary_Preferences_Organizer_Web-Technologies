//help popup
document.addEventListener("DOMContentLoaded", function () {
  var helpLink = document.getElementById("help-link");
  var helpModal = document.getElementById("help-popup");

  helpLink.addEventListener("click", function (event) {
    event.preventDefault();
    helpModal.style.display = "block";
  });
  var closeButton = document.getElementsByClassName("close")[0];
  closeButton.addEventListener("click", function () {
    helpModal.style.display = "none";
  });
  //click oriunde inafara modalului => se inchide
  window.addEventListener("click", function (event) {
    if (event.target == helpModal) {
      helpModal.style.display = "none";
    }
  });
});

// se minimizeaza headerul la scroll doar cand ecranul e mai mic de 1250px
document.addEventListener("DOMContentLoaded", function() {
  const header = document.querySelector("header");
  const originalHeight = header.offsetHeight;
  const mediaQuery = window.matchMedia("(max-width: 1250px)");
  let isMinimized = false;

  function checkScroll() {
      if (mediaQuery.matches) {
          if (window.scrollY > originalHeight && !isMinimized) {
              header.classList.add("minimized-header");
              isMinimized = true;
          } else if (window.scrollY <= originalHeight && isMinimized) {
              header.classList.remove("minimized-header");
              isMinimized = false;
          }
      } else {
          // Ensure the header returns to its original state when the screen is wider than 1250px
          header.classList.remove("minimized-header");
          isMinimized = false;
      }
  }

  window.addEventListener("scroll", checkScroll);
  window.addEventListener("resize", checkScroll);

  // Initial check
  checkScroll();
});

// event listener pentru cardurile de la categorii
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", function (event) {
    event.preventDefault();

    const targetId = this.getAttribute("href").substring(1);

    document.getElementById(targetId).scrollIntoView({
      behavior: "smooth",
      block: "start", //aliniere
    });

    // delete the previously selected section when another one is clicked
    document.querySelectorAll("section").forEach((section) => {
      section.classList.remove("section-selected"); // remove the class from all sections
      section.style.marginTop = ""; // reset margin-top property
    });
    // add a class to the target section to indicate it's selected
    document.getElementById(targetId).classList.add("section-selected");
  });
});

// event listener pentru logo, te duce in susul paginii
const logo = document.querySelector(".logo");
logo.addEventListener("click", function (event) {
  event.preventDefault();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  // Remove section-selected class and reset margin-top from all sections when automatically scrolling back with the logo
  document.querySelectorAll("section").forEach((section) => {
    section.classList.remove("section-selected");
    section.style.marginTop = ""; // Reset margin-top property
  });
});

//event listener pentru filtre
document.addEventListener('DOMContentLoaded', (event) => {
  const rangeInput = document.getElementById('price-filter');
  const minValueDisplay = document.getElementById('min-value');

  rangeInput.addEventListener('input', () => {
      minValueDisplay.textContent = rangeInput.value;
  });
});