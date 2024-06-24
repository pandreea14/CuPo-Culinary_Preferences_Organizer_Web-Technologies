import { removeFromFavorites } from "./addToFavorites.js";
import { fetchAndDisplayShoppingLists } from "./addToShoppingList.js";
import { getToken, parseJwt } from "./tokenScript.js";

async function loadFavorites() {
  const token = getToken();
  const user = parseJwt(token); // Assuming you have a function to parse the JWT token and get the user info

  // Fetch favorite items for the user
  try {
    const favoriteResponse = await fetch(`/api/favorites?user=${user.email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!favoriteResponse.ok) {
      throw new Error("Failed to fetch favorite food data");
    }
    const favoriteFoods = await favoriteResponse.json();

    const favoriteContainer = document.querySelector(".product-container");
    if (!favoriteContainer) {
      console.error("Favorite container not found");
      return;
    }
    favoriteContainer.innerHTML = ""; // Clear existing content

    if (favoriteFoods.length === 0) {
      favoriteContainer.innerHTML =
        "<p>Haven't selected any favorite foods yet!</p>";
    } else {
      favoriteFoods.forEach((favoriteFood) => {
        const favoriteHtml = `
                    <div class="product-item">
                        <h2>${favoriteFood.name}</h2>
                        <div class="product-info">
                            <img src="${favoriteFood.image}" alt="${favoriteFood.name}" class="image">
                            <div class="details">
                                <p>Calories: ${favoriteFood.calories} <br> Allergens: ${favoriteFood.alergens} <br> Expiration: ${favoriteFood.expiration}</p>
                            </div>
                        </div>
                        <div class="buttons">
                            <button class="remove-button">Remove</button>
                            <button class="shopping-button">Add to shopping list</button>
                        </div>
                    </div>
                `;
        favoriteContainer.insertAdjacentHTML("beforeend", favoriteHtml);
      });
    }

    // Add event listeners for new buttons
    favoriteContainer.addEventListener("click", function (event) {
      if (event.target.classList.contains("remove-button")) {
        const productItem = event.target.closest(".product-item");
        const foodName = productItem.querySelector("h2").textContent;
        removeFromFavorites(foodName, event.target);
        // removeFromFavorites(productItem);
        console.log(
          "Removed from favorites:",
          productItem.querySelector("h2").textContent
        );
        productItem.remove();
      } else if (event.target.classList.contains("shopping-button")) {
        const productItem = event.target.closest(".product-item");
        const foodItem = productItem.querySelector('h2').textContent;
        const shoppingListModal = document.getElementById("shoppingListModal");
        if (shoppingListModal) {
            shoppingListModal.style.display = "block";
            fetchAndDisplayShoppingLists(foodItem);
        }
      }
    });
  } catch (error) {
    console.error("An error occurred in fetching favorite food data:", error);
    alert("An error occurred in fetching favorite food data. " + error.message);
  }
}

// Load favorites on DOMContentLoaded
document.addEventListener("DOMContentLoaded", async function () {
  await loadFavorites();

  document.body.addEventListener('click', function (event) {
    const productItem = event.target.closest('.product-item');
    if (!productItem) {
        return;
    }

    document.querySelectorAll('.product-item').forEach(item => item.classList.remove('selected'));
    productItem.classList.add('selected');

    if (event.target.classList.contains('shopping-button')) {
        const foodItem = productItem.querySelector('h2').textContent;
        const shoppingListModal = document.getElementById("shoppingListModal");
        if (shoppingListModal) {
            shoppingListModal.style.display = "block";
            fetchAndDisplayShoppingLists(foodItem);
        }
    }
});

  window.addEventListener("click", function (event) {
    const shoppingListModal = document.getElementById("shoppingListModal");
    if (event.target == shoppingListModal) {
      shoppingListModal.style.display = "none";
    }
  });

  const closeButton = document.querySelector(".modalsh .close");
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      const shoppingListModal = document.getElementById("shoppingListModal");
      shoppingListModal.style.display = "none";
    });
  }
});
