import { getToken } from "./tokenScript.js";

export function fetchUsers() {
    fetch("/api/users")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((users) => {
            const usersTableBody = document.querySelector("#usersTable tbody");
            usersTableBody.innerHTML = ""; // Clear existing rows
            users.forEach((user) => {
                const row = usersTableBody.insertRow();
                const idCell = row.insertCell();
                const emailCell = row.insertCell();
                const roleCell = row.insertCell();
                const actionCell = row.insertCell();
                idCell.textContent = user.id;
                emailCell.textContent = user.email;
                roleCell.innerHTML = `<select>
                    <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
                    <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
                </select>`;

                const roleSelect = roleCell.querySelector('select');
                roleSelect.addEventListener('change', function () {
                    if (confirm("Are you sure you want to change this user's role?")) {
                        updateUserRole(user.id, roleSelect.value);
                    } else {
                        roleSelect.value = user.role; 
                    }
                });

                // Create the delete button
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "delete-btn"; 
                deleteButton.addEventListener("click", function () {
                    deleteUser(user.id);
                });

                actionCell.appendChild(deleteButton); // append the delete button to the action cell
            });
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
        });
}

export function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        fetch(`/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log(`User with ID: ${userId} deleted successfully.`);
                fetchUsers();
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
            });
    }
}

export function fetchFoods() {
    fetch("/api/food?category=all")
        .then((response) => response.json())
        .then((foods) => {
            const foodsTableBody = document.querySelector("#foodsTable tbody");
            foodsTableBody.innerHTML = "";
            foods.forEach((food) => {
                const row = foodsTableBody.insertRow();
                const idCell = row.insertCell();
                const nameCell = row.insertCell();
                const categoryCell = row.insertCell();
                const caloriesCell = row.insertCell();
                const allergensCell = row.insertCell();
                const expirationCell = row.insertCell();
                const actionCell = row.insertCell();

                idCell.textContent = food.id;
                nameCell.contentEditable = true;
                categoryCell.contentEditable = true;
                caloriesCell.contentEditable = true;
                allergensCell.contentEditable = true;
                expirationCell.contentEditable = true;

                nameCell.textContent = food.name;
                categoryCell.textContent = food.category;
                caloriesCell.textContent = food.calories;

                if (Array.isArray(food.allergens)) {
                    allergensCell.textContent = food.alergens.join(", ");
                } else {
                    allergensCell.textContent = food.alergens || '';
                }

                expirationCell.textContent = food.expiration;

                // Create the edit button
                const editButton = document.createElement("button");
                editButton.textContent = "Save";
                editButton.className = "edit-btn"; 
                editButton.addEventListener("click", function () {
                    if (confirm("Are you sure you want to update this product?")) {
                        const updatedFood = {
                            id: food.id,
                            name: nameCell.textContent,
                            category: categoryCell.textContent,
                            calories: parseInt(caloriesCell.textContent, 10), 
                            allergens: allergensCell.textContent.split(",").map(a => a.trim()), 
                            expiration: expirationCell.textContent
                        };
                        updateFood(updatedFood);
                    }
                });

                actionCell.appendChild(editButton); // append the edit button to the action cell

                row.addEventListener("click", () => {
                    const selectedRow = document.querySelector(".selected-row");
                    if (selectedRow) {
                        selectedRow.classList.remove("selected-row");
                    }
                    row.classList.add("selected-row");
                });
            });
        })
        .catch((error) => console.error("Error fetching foods:", error));
}

export function updateFood(food) {
    fetch(`/api/food/${food.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(food),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(`Food with ID: ${food.id} updated successfully.`);
            fetchFoods();
        })
        .catch((error) => {
            console.error("Error updating food:", error);
        });
}

export function updateUserRole(userId, newRole) {
    fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ role: newRole }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(`User with ID: ${userId} role updated to ${newRole} successfully.`);
            fetchUsers();
        })
        .catch((error) => {
            console.error("Error updating user role:", error);
        });
}
