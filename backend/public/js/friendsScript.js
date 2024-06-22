document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('friendSearchForm');
    const friendEmailInput = document.getElementById('friendEmailInput');
    const friendsContainer = document.querySelector('.friend-container'); // Container to append friends

    searchForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const friendEmail = friendEmailInput.value.trim();
        if (!friendEmail) {
            alert('Please enter a valid email to search.');
            return;
        }

        const token = getToken(); // Function to get the JWT token
        if (!token) {
            alert('You must be logged in to search for friends.');
            return;
        }

        try {
            const response = await fetch(`/api/searchFriend?email=${encodeURIComponent(friendEmail)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Friend search failed.');
            }

            const result = await response.json();
            displaySearchResult(result);
        } catch (error) {
            console.error('An error occurred:', error);
            alert('Friend search failed. ' + error.message);
        }
    });

    function displaySearchResult(result) {
        // Clear previous friend container content
        friendsContainer.innerHTML = '';
    
        if (result.error) {
            // Check for error message
            friendsContainer.innerHTML = `<div class="text"><p>${result.error}</p></div>`;
            return;
        }
    
        if (Array.isArray(result) && result.length > 0) {
            // Iterate over each result to generate HTML
            result.forEach(user => {
                const friendHtml = `
                    <div class="friend">
                        <p>Email: ${user.email}</p>
                        <!-- Add more details as needed -->
                    </div>
                `;
                // Append the friendHtml to the friends container
                friendsContainer.innerHTML += friendHtml;
            });
        } else {
            // Handle case where result is not an array or is empty
            friendsContainer.innerHTML = `<div class="text"><p>No users found.</p></div>`;
        }
    }
});
