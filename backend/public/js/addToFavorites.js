export async function addToFavorites(food) {
    console.log('Adding to favorites:', food.name);

    const token = localStorage.getItem('token');
    const user = parseJwt(token); // Assuming you have a function to parse the JWT token and get the user info

    // Make a POST request to add the favorite item
    try {
        const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userEmail: user.email, foodName: food.name })
        });

        if (response.status === 409) {
            alert('This item is already in your favorites.');
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to add favorite');
        }

        alert('Favorite added successfully');

        // button.textContent = 'Remove from Favorites';
        // button.classList.remove('fave-button');
        // button.classList.add('remove-button');

    } catch (error) {
        console.error('An error occurred in adding favorite food:', error);
        alert('An error occurred in adding favorite food. ' + error.message);
    }
}

export async function removeFromFavorites(food, button) {
    console.log('Removing from favorites:', food.name);

    const token = localStorage.getItem('token');
    const user = parseJwt(token); // Assuming you have a function to parse the JWT token and get the user info

    // Make a DELETE request to remove the favorite item
    try {
        const response = await fetch('/api/favorites', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userEmail: user.email, foodName: food.name })
        });

        if (!response.ok) {
            throw new Error('Failed to remove favorite');
        }

        console.log('Favorite removed successfully');
        button.textContent = 'Add to Favorites';
        button.classList.remove('remove-button');
        button.classList.add('fave-button');
    } catch (error) {
        console.error('An error occurred in removing favorite food:', error);
        alert('An error occurred in removing favorite food. ' + error.message);
    }
}

// Function to parse JWT token - browser style
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}