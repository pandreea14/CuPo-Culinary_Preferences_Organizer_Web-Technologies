import { getToken, parseJwt } from './tokenScript.js';

export async function fetchAndDisplayShoppingLists(foodName) {
    const token = getToken();
    const user = parseJwt(token);
    try {
        const response = await fetch(`/api/shoppingList?user=${user.email}`);
        if (!response.ok) {
            throw new Error('Failed to fetch shopping lists');
        }
        const shoppingLists = await response.json();
        updateShoppingListModal(shoppingLists, foodName);
    } catch (error) {
        console.error('Error fetching shopping lists:', error);
    }
}
function updateShoppingListModal(shoppingLists, foodName) {
    const modalContent = document.getElementById('shoppingListTitles');
    modalContent.innerHTML = '';

    console.log('Updating shopping list modal with lists:', shoppingLists);
    if (shoppingLists.length === 0) {
        console.log('No shopping lists found');
        modalContent.innerHTML = '<p>Go to the shopping list page to create a list.</p>';
        return;
    }

    const list = document.createElement('div');
    list.className = 'lists-container';
    shoppingLists.forEach(listItem => {
        const item = document.createElement('button');
        item.textContent = listItem.title;
        item.classList.add('button-item');
        item.dataset.listName = listItem.title;
        
        item.addEventListener('click', function() {
            addToShoppingList(foodName, this.dataset.listName);
        });
        
        list.appendChild(item);
    });
    modalContent.appendChild(list);
}

// add item onto selected shopping list
export async function addToShoppingList(food, listName) {
    console.log('Adding to shopping list:', food, listName);
    
    const token = getToken();
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
        
        const result = await response.json();

        if (response.status === 409) {
            alert('Item already exists in the shopping list.');
            return;
        }

        if (!response.ok) {
            throw new Error(result.error || 'Failed to add item to shopping list');
        }

        console.log('Item added to shopping list successfully:', result);
        alert('Item added to shopping list successfully');

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
 
             // append the new list to the container
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