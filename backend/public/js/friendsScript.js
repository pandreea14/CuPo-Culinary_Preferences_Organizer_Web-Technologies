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

    const token = getToken();
    if (!token) {
      alert("You must be logged in to search for friends.");
      return;
    }
    parseJwt(token);

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
    friendsContainer.innerHTML = "";

    if (result.error) {
      friendsContainer.innerHTML = `<div class="text"><p>${result.error}</p></div>`;
      return;
    }

    if (Array.isArray(result) && result.length > 0) {
      result.forEach((user) => {
        const friendHtml = `
                    <div class="friend">
                        <p>User: <br>${user.email}</p>
                    </div>
                `;
        friendsContainer.innerHTML += friendHtml;
      });
    } else {
      friendsContainer.innerHTML = `<div class="text"><p>No users found.</p></div>`;
    }
  }
});