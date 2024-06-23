import { addToFavorites } from './addToFavorites.js';
import { fetchAndDisplayShoppingLists } from './addToShoppingList.js';

async function fetchAllFoodData() {

    try {
        const response = await fetch('/api/food?category=all');
        if (!response.ok) {
            throw new Error('Failed to fetch food data');
        }
        const foods = await response.json();
        const categories = {
            'Fruits': 'fruits',
            'Vegetables': 'vegetables',
            'Meat': 'meat',
            'Seafood': 'meat',
            'Bread': 'grains',
            'Pasta': 'grains',
            'Dairy': 'dairy',
            'Snacks': 'snacks',
            'Beverages': 'beverages',
            'Sauces': 'sauce',
            'Sauce': 'sauce',
            'Condiments': 'sauce',
            'Canned Goods': 'cannedgoods',
            'Frozen Food': 'frozenfood'
        };

        foods.forEach(food => {
            const categoryId = categories[food.category];
            const productContainer = document.querySelector(`#${categoryId} .product-container`);
            const productHtml = `
               <div class="product-item">
                    <h2 class="item">${food.name}</h2>
                    <div class="product-info">
                        <img src="${food.image}" alt="${food.name}" class="image">
                        <div class="details">
                            <p class="text">Calories: ${food.calories} <br> Allergens: ${food.alergens} <br> Expiration: ${food.expiration} days</p>
                        </div>
                    </div>
                    <div class="buttons">
                        <button class="fave-button">Add to Favorites</button>
                        <button class="shopping-button">Add to shopping list</button>
                    </div>
                </div>
            `;
            if (productContainer) {
                productContainer.insertAdjacentHTML('beforeend', productHtml);
            } else {
                console.error(`Could not find product container for category ${food.category}`);
            }
        });
    } catch (error) {
        console.error('An error occurred in fetching food data:', error);
        alert('An error occurred in fetching food data. ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    await fetchAllFoodData();

    document.body.addEventListener('click', function (event) {
        const productItem = event.target.closest('.product-item');
        if (!productItem) {
            return;
        }

        document.querySelectorAll('.product-item').forEach(item => item.classList.remove('selected'));
        productItem.classList.add('selected');

        if (event.target.classList.contains('fave-button')) {
            const foodItem = productItem.querySelector('h2').textContent;
            addToFavorites({ name: foodItem });
        } else if (event.target.classList.contains('shopping-button')) {
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

    // Optional: Close the modal if the user clicks outside of it
//     window.addEventListener("click", function (event) {
//         if (event.target == shoppingListModal) {
//             shoppingListModal.style.display = "none";
//         }
//     });

//     // Optional: Close button inside the modal
//     var closeButton = document.querySelector(".modalsh .close");
//     if (closeButton) {
//         closeButton.addEventListener("click", function () {
//             shoppingListModal.style.display = "none";
//         });
//     }
// });

// document.addEventListener("DOMContentLoaded", function () {
//     // Select all "Add to shopping list" buttons
//     var shoppingButtons = document.querySelectorAll(".shopping-button");
//     // Select the shopping list modal
//     var shoppingListModal = document.getElementById("shoppingListModal");
  
//     // Function to open the shopping list modal
//     function openShoppingListModal() {
//       shoppingListModal.style.display = "block";
//     }
  
//     // Add click event listener to each shopping button
//     shoppingButtons.forEach(function(button) {
//       button.addEventListener("click", openShoppingListModal);
//     });
  
//     // Optional: Close the modal if the user clicks outside of it
//     window.addEventListener("click", function (event) {
//       if (event.target == shoppingListModal) {
//         shoppingListModal.style.display = "none";
//       }
//     });
  
//     // Optional: Close button inside the modal
//     var closeButton = document.querySelector(".modalsh .close-button");
//     if (closeButton) {
//       closeButton.addEventListener("click", function () {
//         shoppingListModal.style.display = "none";
//       });
//     }
//   });