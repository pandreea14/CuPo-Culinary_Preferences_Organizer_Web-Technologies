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

        try {
            const response = await fetch('/api/searchFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendEmail }),
            });

            if (!response.ok) {
                throw new Error('Friend search failed.');
            }

            const result = await response.json();
            displaySearchResult(result);
        } catch (error) {
            console.error('An error occurred:', error);
            alert('Friend search failed eroare la catch.');
        }
    });

    function displaySearchResult(result) {
        // Clear previous friend container content
        friendsContainer.innerHTML = '';

        if (result.error) {
            //verifica in caz de eroare
            friendsContainer.innerHTML = `<div class="text"><p>${result.error}</p></div>`;
            return;
        }

        //html intern
        const friendHtml = `
            <div class="friend">
                <p>Email: ${result.email}</p>
                <!-- Add more details as needed -->
            </div>
        `;

        // Append the friendHtml to the friends container
        friendsContainer.innerHTML += friendHtml;
    }
});
