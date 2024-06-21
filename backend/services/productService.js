const { query } = require("../utils/dbUtils");

async function fetchFoodsByCategory(category) {
    let sql;
  
    if (category === "all") {
      sql = "SELECT name, image, category, calories, alergens, expiration FROM produse";
    } else {
      sql = "SELECT name, image, category, calories, alergens, expiration FROM produse WHERE category = ?";
    }
  
    try {
      const results = await query(sql, [category]); // Pass params as the second argument
      return results;
    } catch (error) {
      throw new Error('Failed to fetch products from database');
    }
  }
  
  module.exports = {
    fetchFoodsByCategory
  };
