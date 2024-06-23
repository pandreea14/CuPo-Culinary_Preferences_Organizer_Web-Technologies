document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const query = document.getElementById('searchQuery').value;
    fetchFilteredFoodData(query).then(data => {
        displayResults(data);
    });
});

async function fetchFilteredFoodData(query) {
    try {
        const params = new URLSearchParams();
        if (query) params.append('query', query);

        const response = await fetch(`/api/searchFilter?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch food data');
        }
        const foods = await response.json();
        return foods;
    } catch (error) {
        console.error('An error occurred in fetching food data:', error);
        alert('An error occurred in fetching food data. ' + error.message);
        return [];
    }
}

function displayResults(data) {
    const title = document.getElementById('searchResultsTitle');
    const container = document.getElementById('searchResultsContainer');
    container.innerHTML = '';

    if (data.length === 0) {
        // title.classList.add('hidden');
        // container.classList.add('hidden');
        container.innerHTML = '<p>No results found</p>';
        return;
    }

    title.classList.remove('hidden');
    container.classList.remove('hidden');

    data.forEach(food => {
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
        container.insertAdjacentHTML('beforeend', productHtml);
    });
}
