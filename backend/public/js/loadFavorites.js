async function loadFavorites() {
    const token = localStorage.getItem('token');
    const user = parseJwt(token); // Assuming you have a function to parse the JWT token and get the user info

    // Fetch favorite items for the user
    try {
        const favoriteResponse = await fetch(`/api/favorites?user=${user.email}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!favoriteResponse.ok) {
            throw new Error('Failed to fetch favorite food data');
        }
        const favoriteFoods = await favoriteResponse.json();

        const favoriteContainer = document.querySelector('.product-container');
        if (!favoriteContainer) {
            console.error('Favorite container not found');
            return;
        }
        favoriteContainer.innerHTML = ''; // Clear existing content

        if (favoriteFoods.length === 0) {
            favoriteContainer.innerHTML = '<p>Haven\'t selected any favorite foods yet!</p>';
        } else {
            favoriteFoods.forEach(favoriteFood => {
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
                favoriteContainer.insertAdjacentHTML('beforeend', favoriteHtml);
            });
        }

        // Add event listeners for new buttons
        favoriteContainer.addEventListener('click', function (event) {
            if (event.target.classList.contains('remove-button')) {
                const productItem = event.target.closest('.product-item');
                productItem.remove();
                console.log('Removed from favorites:', productItem.querySelector('h2').textContent);
            } else if (event.target.classList.contains('shopping-button')) {
                const productItem = event.target.closest('.product-item');
                console.log('Added to shopping list:', productItem.querySelector('h2').textContent);
                // Implement the logic to add the food item to the shopping list
            }
        });
    } catch (error) {
        console.error('An error occurred in fetching favorite food data:', error);
        alert('An error occurred in fetching favorite food data. ' + error.message);
    }
}

// Function to parse JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Load favorites on DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadFavorites);


// export async function addToFavorites(food) {
//     console.log('Adding to favorites:', food.name);

//     const token = localStorage.getItem('token');
//     const user = parseJwt(token); // Assuming you have a function to parse the JWT token and get the user info

//     // make a POST request to add the favorite item
//     try {
//         const response = await fetch('/api/favorites', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({ userEmail: user.email, foodName: food.name })
//         });

//         if (!response.ok) {
//             throw new Error('Failed to add favorite');
//         }

//         console.log('Favorite added successfully');

//         // Fetch favorite items for the user
//         const favoriteResponse = await fetch(`/api/favorites?user=${user.email}`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//         if (!favoriteResponse.ok) {
//             throw new Error('Failed to fetch favorite food data');
//         }
//         const favoriteFoods = await favoriteResponse.json();

//         const favoriteContainer = document.querySelector('.product-container');
//         if (!favoriteContainer) {
//             console.error('Favorite container not found');
//             return;
//         }
//         favoriteContainer.innerHTML = ''; // Clear existing content

//         if (favoriteFoods.length === 0) {
//             favoriteContainer.innerHTML = '<p>Haven\'t selected any favorite foods yet!</p>';
//         } else {
//             favoriteFoods.forEach(favoriteFood => {
//                 const favoriteHtml = `
//                     <div class="product-item">
//                         <h2>${favoriteFood.name}</h2>
//                         <div class="product-info">
//                             <img src="${favoriteFood.image}" alt="${favoriteFood.name}" class="image">
//                             <div class="details">
//                                 <p>Calories: ${favoriteFood.calories} <br> Allergens: ${favoriteFood.alergens} <br> Expiration: ${favoriteFood.expiration}</p>
//                             </div>
//                         </div>
//                         <div class="buttons">
//                             <button class="remove-button">Remove</button>
//                             <button class="shopping-button">Add to shopping list</button>
//                         </div>
//                     </div>
//                 `;
//                 favoriteContainer.insertAdjacentHTML('beforeend', favoriteHtml);
//             });
//         }

//         // Add event listeners for new buttons
//         favoriteContainer.addEventListener('click', function (event) {
//             if (event.target.classList.contains('remove-button')) {
//                 const productItem = event.target.closest('.product-item');
//                 productItem.remove();
//                 console.log('Removed from favorites:', productItem.querySelector('h2').textContent);
//             } else if (event.target.classList.contains('shopping-button')) {
//                 const productItem = event.target.closest('.product-item');
//                 console.log('Added to shopping list:', productItem.querySelector('h2').textContent);
//                 // Implement the logic to add the food item to the shopping list
//             }
//         });
//     } catch (error) {
//         console.error('An error occurred in adding favorite food:', error);
//         alert('An error occurred in adding favorite food. ' + error.message);
//     }
// }

// // Function to parse JWT token
// function parseJwt(token) {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
//     return JSON.parse(jsonPayload);
// }