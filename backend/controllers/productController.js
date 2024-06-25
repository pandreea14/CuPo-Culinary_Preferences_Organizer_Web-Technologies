const {
  fetchFoodsByCategory,
  fetchFoodsByFilter,
} = require("../services/productService");

const getFood = async (request, response) => {
  try {
    const { category } = request.query;
    if (!category) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Category parameter is required" }));
      return;
    }
    const products = await fetchFoodsByCategory(category);

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching food data:", error);
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

const url = require('url');
const { query } = require("../utils/dbUtils");

async function getResult(request, response) {
  try {
    const parsedUrl = url.parse(request.url, true);
    const { query, maxCalories, maxExpiration, alergens } = parsedUrl.query;
    console.log(
      "Query Parameters:",
      query,
      maxCalories,
      maxExpiration,
      alergens
    );

    const products = await fetchFoodsByFilter(
      query,
      maxCalories,
      maxExpiration,
      alergens
    );
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(products));
  } catch (error) {
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

const updateProduct = async (req, res) => {
  let body = '';
  req.on('data', chunk => {
      body += chunk.toString();
  });

  req.on('end', async () => {
      const { id, name, category, calories, allergens, expiration } = JSON.parse(body);

      try {
          await query('UPDATE produse SET name = ?, category = ?, calories = ?, alergens = ?, expiration = ? WHERE id = ?', 
              [name, category, calories, allergens.join(','), expiration, id]);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: `Food with ID: ${id} updated successfully.` }));
      } catch (error) {
          console.error('Error updating food:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
      }
  });
};


module.exports = {
  getFood,
  getResult,
  updateProduct,
};