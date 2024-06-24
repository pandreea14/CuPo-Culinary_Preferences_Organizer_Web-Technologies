const { query } = require("../utils/dbUtils");

// Adds the shopping list to the database
async function addShoppingList(userEmail, listName) {
  const sql = "INSERT INTO shoppinglists (email, title) VALUES (?, ?)";
  const params = [userEmail, listName];

  try {
    const results = await query(sql, params);
    if (results.affectedRows === 0) {
      // Assuming a MySQL database for affectedRows property
      return { error: "User not found or list not added." };
    }

    return { message: "Shopping list successfully added." };
  } catch (error) {
    console.error("Error adding shopping list to db:", error);
    throw error; // Rethrow or handle as needed
  }
}

//versiunea 1
// async function fetchShoppingLists(userEmail) {
//   const sql = "SELECT * FROM shoppinglists WHERE email = ?";
//   const params = [userEmail];

//   try {
//     const results = await query(sql, params);
//     if (results.length === 0) {
//       return { message: "No shopping lists found." };
//     }
//     return results;
//   } catch (error) {
//     console.error("Error fetching shopping lists from db:", error);
//     throw error; // Rethrow or handle as needed
//   }
// }

async function fetchShoppingLists(userEmail) {
  const sql = `
    SELECT 
      sl.id AS list_id, sl.title, GROUP_CONCAT(sli.food_name) AS items
    FROM 
      shoppinglists sl
    LEFT JOIN 
      shoppinglist_items sli 
    ON 
      sl.id = sli.shoppinglist_id
    WHERE 
      sl.email = ?
    GROUP BY 
      sl.id, sl.title
  `;
  const params = [userEmail];

  try {
    const results = await query(sql, params);
    return results.map((result) => ({
      title: result.title,
      items: result.items ? result.items.split(",") : [],
    }));
  } catch (error) {
    console.error("Error fetching shopping lists from db:", error);
    throw error; // Rethrow or handle as needed
  }
}

async function deleteList(user, list) {
  const sql = "DELETE FROM shoppinglists WHERE email = ? AND title = ?";
  const params = [user, list];
  try {
    const results = await query(sql, params);
    if (results.affectedRows === 0) {
      return { error: "Shopping list not found or could not be deleted." };
    }
    return { message: "Shopping list successfully deleted." };
  } catch (error) {
    console.error("Error removing shopping list from db:", error);
    throw error; // Rethrow or handle as needed
  }
}

async function addItemToShoppingList(userEmail, listName, foodName) {
  try {
    // Get the shopping list ID
    const listIdResult = await query(
      "SELECT id FROM shoppinglists WHERE title = ? AND email = ?",
      [listName, userEmail]
    );
    if (listIdResult.length === 0) {
      throw new Error("Shopping list not found");
    }
    const listId = listIdResult[0].id;

    // Check if the item already exists in the list
    const existingItemResult = await query(
      "SELECT shoppinglist_id FROM shoppinglist_items WHERE email = ? AND food_name = ?",
      [userEmail, foodName]
    );
    if (existingItemResult.length > 0) {
      return { error: "Item already exists in the shopping list." };
    }

    // Insert the new item into shoppinglist_items
    const results = await query(
      "INSERT INTO shoppinglist_items (shoppinglist_id, food_name, email) VALUES (?, ?, ?)",
      [listId, foodName, userEmail]
    );
    if (results.affectedRows === 0) {
      return { error: "Couldn't insert item into shopping list." };
    }

    return { message: "Item successfully added to the shopping list." };
  } catch (error) {
    console.error("Error fetching food data:", error);
    throw error;
  }
}

async function deleteItemFromList(userEmail, listName, food) {
  const listIdResult = await query(
    "SELECT id FROM shoppinglists WHERE title = ? AND email = ?",
    [listName, userEmail]
  );
  if (listIdResult.length === 0) {
    throw new Error("Shopping list not found");
  }
  const listId = listIdResult[0].id;

  const sql = "DELETE FROM shoppinglist_items WHERE email = ? AND food_name = ? AND shoppinglist_id = ?";
  const params = [userEmail, food, listId];
  try {
    const results = await query(sql, params);
    if (results.affectedRows === 0) {
      return { error: "Item not found or could not be deleted." };
    }
    return { message: "Item successfully deleted." };
  } catch (error) {
    console.error("Error removing item from db:", error);
    throw error; // Rethrow or handle as needed
  }
}

module.exports = {
  addShoppingList,
  fetchShoppingLists,
  deleteList,
  addItemToShoppingList,
  deleteItemFromList,
};
