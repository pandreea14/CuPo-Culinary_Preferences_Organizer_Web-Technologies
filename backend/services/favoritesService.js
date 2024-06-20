const { query } = require("../utils/dbUtils");

async function addFavoriteItem(user, foodItem) {
  const checkSql =
    "SELECT * FROM user_favorites WHERE email = ? AND food_name = ?";
  const checkParams = [user, foodItem];
  const existingFavorites = await query(checkSql, checkParams);

  if (existingFavorites.length > 0) {
    console.log(existingFavorites);
    return { alreadyExists: true };
    // throw new Error('Item already in favorites');
  }

  const sql = "INSERT INTO user_favorites (email, food_name) VALUES (?, ?)";
  const params = [user, foodItem];
  await query(sql, params);
  return { alreadyExists: false };
}

async function fetchFavoriteItems(user) {
  const sql = `
      SELECT produse.*
      FROM produse
      JOIN user_favorites ON produse.name = user_favorites.food_name
      WHERE user_favorites.email = ?
    `;
  const params = [user];
  try {
    const results = await query(sql, params);
    return results;
  } catch (error) {
    console.error("Error fetching favorite items:", error);
    throw error; // Rethrow or handle as needed
  }
}

// async function deteleFavoriteItem(user) {
//     const sql = "DELETE FROM users_favorites WHERE email = ? AND food_name = ?"
// }

module.exports = {
  addFavoriteItem,
  fetchFavoriteItems,
  //   deleteFavoriteItem
};
