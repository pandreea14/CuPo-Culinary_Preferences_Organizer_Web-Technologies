import { getToken, parseJwt } from "./tokenScript.js";

async function loadShoppingLists() {
  const token = getToken();
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

    console.log(shoppingLists); 

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
          <div class="shoppinglist-container" data-title="${list.title}">
            <div class="list-title">
              <i><b>${list.title}</b></i>
            </div>
            <div class="content">
              <ul>
                ${
                  list.items.length
                    ? list.items
                        .map(
                          (item) => `
                            <li>
                              <div class="list-item-container">
                                <span>${item}</span>
                                <button class="item-remove-button" data-item="${item}" data-list="${list.title}">Remove</button>
                              </div>
                            </li>`
                        )
                        .join("")
                    : "<span>No items yet in this list</span>"
                }
              </ul>
            </div>
            <button class="remove-button"><b>DELETE LIST</b></button>
          </div>
        `;
        shContainer.insertAdjacentHTML("beforeend", shHtml);
      });
    }
  } catch (error) {
    console.error("An error occurred in fetching shopping list data:", error);
    alert("An error occurred in fetching shopping list data. " + error.message);
  }
}

async function removeItemFromList(item, listName) {
  const token = getToken();
  const user = parseJwt(token);

  try {
    const response = await fetch(`/api/createShoppingList`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userEmail: user.email, listName: listName, foodName: item }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove item from shopping list");
    }

    const result = await response.json();
    console.log('Item removed from shopping list successfully:', result);
    alert('Item removed from shopping list successfully');
    
    const itemButton = document.querySelector(`button[data-item="${item}"][data-list="${listName}"]`);
    if (itemButton) {
      const listItem = itemButton.closest('li');
      if (listItem) {
        listItem.remove();
      }
    }
  } catch (error) {
    console.error('Error removing item from shopping list:', error);
    alert("Failed to remove item from shopping list. " + error.message);
  }
}

// Event delegation for dynamically added elements
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('item-remove-button')) {
    const item = event.target.dataset.item;
    const listName = event.target.dataset.list;
    console.log('Remove button clicked for item:', item, 'in list:', listName);
    removeItemFromList(item, listName);
  }
});

async function removeShoppingList(listName) {
  console.log("Removing from shopping list:", listName);

  const confirmRemoval = window.confirm(
    "Are you sure you want to delete this shopping list?"
  );
  if (!confirmRemoval) {
    console.log("Removal cancelled");
    return false;
}

  const token = getToken();
  const user = parseJwt(token);

  // Remove the list
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

    console.log("Shopping list removed successfully");
    return true;
  } catch (error) {
    console.error("An error occurred in removing sh:", error);
    alert("An error occurred in removing sh. " + error.message);
    return false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadShoppingLists();

  const staticParentElement = document.querySelector(".grid-container"); 
  staticParentElement.addEventListener("click", async function (event) {
    if (event.target.closest(".remove-button")) {
      const shoppingList = event.target.closest(".shoppinglist-container");
      const listName = shoppingList.querySelector("b").textContent;
      console.log("Remove button clicked, listName:", listName);
      try {
        const success = await removeShoppingList(listName);
        if (success) {
          shoppingList.remove(); // Remove the shopping list element after successful deletion
          console.log("Shopping list element removed from DOM");
        }
      } catch (error) {
        console.error("Failed to remove shopping list:", error);
        alert("Failed to remove shopping list. " + error.message);
      }
    }
  });

  document
    .querySelector(".new-shoppinglist")
    .addEventListener("click", async function (event) {
      event.preventDefault(); // Prevent form submission

      const token = getToken();
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

        console.log(result); 
        const newListHTML = `
          <div class="shoppinglist-container" data-title="${listName}">
            <div class="list-title">
              <i><b>${listName}</b></i>
            </div>
            <div class="content">
              <ul>
                <li>
                  <div class="list-item-container">
                    <span>No items yet in this list</span>
                  </div>
                </li>
              </ul>
            </div>
            <button class="remove-button"><b>DELETE LIST</b></button>
          </div>
        `;

        // Append the new list to the container
        const shContainer = document.querySelector(".grid-container");
        if (shContainer) {
          const messageElement = shContainer.querySelector("p");
          if (messageElement && messageElement.textContent.includes("Haven't created any shopping lists yet!")) {
            messageElement.remove();
          }

          shContainer.insertAdjacentHTML("beforeend", newListHTML);
        } else {
          console.error('Shopping lists container not found');
        }

        document.getElementById("listNameInput").value = "";
      } catch (error) {
        console.error("An error occurred:", error);
        alert("Failed to add shopping list. " + error.message);
      }
    });
});