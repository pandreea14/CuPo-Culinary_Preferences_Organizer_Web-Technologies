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

// event listener pentru logo, te duce in susul paginii
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
  minValue.textContent = priceFilter.value;
    maxValue.textContent = priceFilter.max;
});



//heeelp popup
var helpLink = document.getElementById("help-link");
var helpModal = document.getElementById("help-popup");

helpLink.addEventListener("click", function(event) {
    event.preventDefault();
    helpModal.style.display = "block";
});
var closeButton = document.getElementsByClassName("close")[0];
closeButton.addEventListener("click", function() {
    helpModal.style.display = "none";
});
//click oriunde inafara modalului => se inchide
window.addEventListener("click", function(event) {
    if (event.target == helpModal) {
        helpModal.style.display = "none";
    }
});


//event listener pentru adaugarea favoritelor
