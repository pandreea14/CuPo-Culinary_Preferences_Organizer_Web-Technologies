const { query } = require("../utils/dbUtils");

async function fetchFoodsByCategory(category) {
    let sql;
  
    if (category === "all") {
      sql = "SELECT * FROM produse";
    } else {
      sql = "SELECT * FROM produse WHERE category = ?";
    }
  
    try {
      const results = await query(sql, [category]);
      return results;
    } catch (error) {
      throw new Error('Failed to fetch products from database');
    }
  }

  async function fetchFoodsByFilter(search, maxCalories, minExpiration, alergens) {
    let sql = "SELECT * FROM produse WHERE 1=1";
    const params = [];
  
    if (search) {
      sql += " AND name LIKE ?";
      params.push(`%${search}%`);
    }
  
    if (maxCalories) {
      sql += " AND calories <= ?";
      params.push(maxCalories);
    }
  
    if (minExpiration) {
      sql += " AND expiration >= ?";
      params.push(minExpiration);
    }
  
    if (alergens && alergens !== "none") {
      sql += " AND alergens NOT LIKE ?";
      params.push(`%${alergens}%`);
    }
  
    try {
      const results = await query(sql, params);
      return results;
    } catch (error) {
      console.error("Error fetching foods from db:", error);
      throw error;
    }
  }
  
  module.exports = {
    fetchFoodsByCategory, 
    fetchFoodsByFilter
  };
