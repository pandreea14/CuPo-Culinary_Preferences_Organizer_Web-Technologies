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
document.addEventListener('DOMContentLoaded', function () {
    fetchAllFoodData();
});
