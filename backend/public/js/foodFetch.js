import { addToFavorites } from './addToFavorites.js';

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
                    <h2>${food.name}</h2>
                    <div class="product-info">
                        <img src="${food.image}" alt="${food.name}" class="image">
                        <div class="details">
                            <p class="text">Calories: ${food.calories} <br> Allergens: ${food.alergens} <br> Expiration: ${food.expiration}</p>
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

async function addToShoppingList(food) {
    console.log('Adding to shopping list:', food.name);
    // Implement the logic to add the food item to the shopping list
}

document.addEventListener('DOMContentLoaded', function () {
    fetchAllFoodData();
    document.body.addEventListener('click', function (event) {
        console.log('Click event detected on body');
        const productItem = event.target.closest('.product-item');
        if (!productItem) {
            console.error('Could not find product-item ancestor');
            return;
        }

        if (event.target.classList.contains('fave-button')) {
            console.log('Favorite button clicked');
            const foodItem = productItem.querySelector('h2').textContent;
            console.log('Clicked Add to Favorites:', foodItem);
            addToFavorites({ name: foodItem });
        } else if (event.target.classList.contains('shopping-button')) {
            console.log('Shopping button clicked');
            const foodItem = productItem.querySelector('h2').textContent;
            console.log('Clicked Add to Shopping List:', foodItem);
            addToShoppingList({ name: foodItem });
        }
    });
});