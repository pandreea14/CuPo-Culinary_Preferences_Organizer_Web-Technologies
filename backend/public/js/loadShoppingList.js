// import { parseJwt } from "./tokenScript.js";
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

//displaying the existing shopping lists
async function loadShoppingLists() {
    const token = localStorage.getItem("token");
    const user = parseJwt(token);
    try {
      const shResponse = await fetch(`/api/shoppingList?user=${user.email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!shResponse.ok) {
        throw new Error("Failed to fetch shopping list data");
      }
      const shoppingLists = await shResponse.json();
  
      console.log(shoppingLists); // Debugging line to inspect the shopping lists
  
      const shContainer = document.querySelector(".grid-container");
      if (!shContainer) {
        console.error("Shopping list container not found");
        return;
      }
      shContainer.innerHTML = ""; // Clear existing content
  
      if (shoppingLists.length === 0) {
        shContainer.innerHTML = "<p>Haven't created any shopping lists yet!</p>";
      } else {
        shoppingLists.forEach((list) => {
          const shHtml = `
                      <div class="shoppinglist-container">
                            <div class="list-title">
                            <i><b>${list.title}</b></i>
                            </div>
                            <p>with ${user.email}</p>
                            <div class="content">
                            <div class="list-item-container">
                                ${list.items.length ? list.items.map(item => `<span>${item}</span>`).join('') : '<span>no items yet</span>'}
                            </div>
                            </div>
                            <button class="remove-button"><b>DELETE LIST</b></button>
                        </div>
                  `;
          shContainer.insertAdjacentHTML("beforeend", shHtml);
        });
      }
  
      // shContainer.addEventListener("click", function (event) {
      //   console.log("Click event detected on body");
      //   if (event.target.classList.contains("remove-button")) {
      //     const shoppingList = event.target.closest(".shoppinglist-container");
      //     const listName = shoppingList.querySelector("b").textContent;
      //     removeFromShoppingList(listName);
      //     shoppingList.remove();
      //   }
      // });
  
    } catch (error) {
      console.error("An error occurred in fetching shopping list data:", error);
      alert("An error occurred in fetching shopping list data. " + error.message);
    }
  }
  
  async function removeShoppingList(listName) {
    console.log("Removing from shopping list:", listName);
  
    const confirmRemoval = window.confirm(
      "Are you sure you want to delete this shopping list?"
    );
    if (!confirmRemoval) {
      return;
    }
  
    const token = localStorage.getItem("token");
    const user = parseJwt(token);
  
    //DELETE request to remove the favorite item
    try {
      const response = await fetch("/api/shoppingList", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userEmail: user.email, listName: listName }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to remove shopping list");
      }
  
      console.log("shopping list removed successfully");
    } catch (error) {
      console.error("An error occurred in removing sh:", error);
      alert("An error occurred in removing sh. " + error.message);
    }
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    loadShoppingLists();
  
    // Attach event listener to a static parent element
    document.querySelector('.grid-container').addEventListener('click', function (event) {
      console.log("Click event detected on body");
      if (event.target.classList.contains('remove-button')) {
        const shoppingList = event.target.closest('.shoppinglist-container');
        const listName = shoppingList.querySelector('b').textContent;
        removeShoppingList(listName).then(() => {
          //aici se sterge si cand dai pe cancel:))
          shoppingList.remove(); // Remove the shopping list element after successful deletion
        }).catch(error => {
          console.error('Failed to remove shopping list:', error);
          alert('Failed to remove shopping list. ' + error.message);
        });
      }
    });
  
    document
      .querySelector(".new-shoppinglist")
      .addEventListener("click", async function (event) {
        event.preventDefault(); // Prevent form submission
  
        const token = localStorage.getItem("token");
        const user = parseJwt(token);
  
        const listName = document.getElementById("listNameInput").value; // Get the list name
        if (listName.trim() === "") {
          alert("Please enter a list name.");
          return;
        }
  
        try {
          const response = await fetch(`/api/createShoppingList`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userEmail: user.email, listName: listName }),
          });
  
          if (!response.ok) {
            throw new Error("Failed to add shopping list.");
          }
  
          const result = await response.json();
  
          console.log(result); // Debugging line to inspect the result
  
          // Ensure this function is correctly named and implemented for displaying added shopping lists
          // Create the new shopping list HTML
          const newListHTML = `
                  <div class="shoppinglist-container">
                      <div class="list-title">
                          <i><b>${listName}</b></i>
                      </div>
                      <p>with cutarica@nustiucinesunt.con</p>
                      <div class="content">
                          <div class="list-item-container">
                              <span>no items yet</span>
                          </div>
                      </div>
                      <button class="remove-button"><b>DELETE LIST</b></button>
                      
                  </div>
              `;
  
          // Append the new list to the container
          document
            .getElementById("shoppingListsContainer")
            .insertAdjacentHTML("beforeend", newListHTML);
  
          // Optionally, clear the input field after adding
          document.getElementById("listNameInput").value = "";
        } catch (error) {
          console.error("An error occurred:", error);
          alert("Failed to add shopping list. " + error.message);
        }
      });
  
  
  });