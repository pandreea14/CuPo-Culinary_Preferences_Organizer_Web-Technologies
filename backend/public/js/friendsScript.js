import { getToken, parseJwt } from "./tokenScript.js";

document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("friendSearchForm");
  const friendEmailInput = document.getElementById("friendEmailInput");
  const friendsContainer = document.querySelector(".friend-container"); // Container to append friends

  searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const friendEmail = friendEmailInput.value.trim();
    if (!friendEmail) {
      alert("Please enter a valid email to search.");
      return;
    }

    const token = getToken(); // Function to get the JWT token
    if (!token) {
      alert("You must be logged in to search for friends.");
      return;
    }

    try {
      const response = await fetch(
        `/api/searchFriend?email=${friendEmail}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Friend search failed.");
      }

      const result = await response.json();
      displaySearchResult(result);
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Friend search failed. " + error.message);
    }
  });

  async function displaySearchResult(result) {
    // Clear previous friend container content
    friendsContainer.innerHTML = "";

    if (result.error) {
      // Check for error message
      friendsContainer.innerHTML = `<div class="text"><p>${result.error}</p></div>`;
      return;
    }

    if (Array.isArray(result) && result.length > 0) {
      // Iterate over each result to generate HTML
      result.forEach((user) => {
        const friendHtml = `
                    <div class="friend">
                        <p>User: <br>${user.email}</p>
                        <button class="add-newfriends"><i><b>Add friend</b></i></button>
                    </div>
                `;
        // Append the friendHtml to the friends container
        friendsContainer.innerHTML += friendHtml;
      });

      // Add event listeners to the "Add Friend" buttons
      const addFriendButtons = document.querySelectorAll(".add-newfriends");
      addFriendButtons.forEach(button => {
        button.addEventListener("click", async function () {
          const friendEmail = this.dataset.email;
          const result = await addFriend(friendEmail);
          console.log(result);
        });
      });
    } else {
      // Handle case where result is not an array or is empty
      friendsContainer.innerHTML = `<div class="text"><p>No users found.</p></div>`;
    }
  }


  async function addFriend(friendEmail) {
    const token = getToken();
    const user = parseJwt(token);
    
    try {
      const response = await fetch("/api/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userEmail: user.email, friendEmail }),
      });
    
      if (!response.ok) {
        throw new Error("Failed to add friend.");
      }
    
      alert("Friend added successfully.");
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Failed to add friend. " + error.message);
    }
    }

});