import { parseJwt } from './tokenScript.js';

// add item onto selected shopping list
export async function addToShoppingList(food, listName) {
    console.log('Adding to shopping list:', food, listName);
    
    const token = localStorage.getItem("token");
    const user = parseJwt(token);

    try {
        const response = await fetch(`/api/shoppingList`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userEmail: user.email, listName: listName, foodName: food}),
        });

        if (!response.ok) {
            throw new Error('Failed to add item to shopping list');
        }

        const result = await response.json();

        console.log('Item added to shopping list successfully:', result);

         // Find the shopping list in the DOM and update it
         const existingList = document.querySelector(`.shoppinglist-container[data-title="${listName}"]`);
         if (existingList) {
             const itemsContainer = existingList.querySelector('ul');
             if (itemsContainer) {
                 itemsContainer.insertAdjacentHTML('beforeend', `
                     <li>
                         <div class="list-item-container">
                             <span>${food}</span>
                             <button class="item-remove-button">Remove</button>
                         </div>
                     </li>
                 `);
             }
         } else {
             // Create the new shopping list HTML if it doesn't exist
             const newListHTML = `
                 <div class="shoppinglist-container" data-title="${listName}">
                     <div class="list-title">
                         <i><b>${listName}</b></i>
                     </div>
                     <div class="content">
                         <ul>
                             <li>
                                 <div class="list-item-container">
                                     <span>${food}</span>
                                     <button class="item-remove-button">Remove</button>
                                 </div>
                             </li>
                         </ul>
                     </div>
                     <button class="remove-button"><b>DELETE LIST</b></button>
                 </div>
             `;
 
             // Append the new list to the container
             document.addEventListener('DOMContentLoaded', (event) => {
                const shoppingListsContainer = document.getElementById("shoppingListsContainer");
                if (shoppingListsContainer) {
                    alert('Item added to shopping list successfully:', result);
                    shoppingListsContainer.insertAdjacentHTML("beforeend", newListHTML);
                } else {
                    console.error('Shopping lists container not found');
                }
            });
         }

        // Optionally, clear the input field after adding
        // document.getElementById("listNameInput").value = "";
      } catch (error) {
        console.error('Error adding item to shopping list:', error);
        alert("Failed to add shopping list. " + error.message);
      }
}

// remove item from selected shopping list

