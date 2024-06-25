const {
  fetchFoodsByCategory,
  fetchFoodsByFilter,
} = require("../services/productService");

const getFood = async (request, response) => {
  try {
    // Extract the category from the request's query parameters
    const { category } = request.query;
    if (!category) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Category parameter is required" }));
      return;
    }
    // Pass the category to fetchFoodsByCategory
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
  console.log('updateProduct called'); // Log when the function is called
  let body = '';
  req.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
  });
  req.on('end', async () => {
      try {
          const { id, name, category, calories, allergens, expiration } = JSON.parse(body);

          // Validate the incoming data (optional but recommended)
          if (!id || !name || !category || !calories || !expiration) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid input data' }));
              return;
          }

          await query('UPDATE produse SET name = ?, category = ?, calories = ?, alergens = ?, expiration = ? WHERE id = ?', 
              [name, category, calories, allergens.join(','), expiration, id]);
          
          console.log(`Product with ID: ${id} updated successfully.`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: `Product with ID: ${id} updated successfully.` }));
      } catch (error) {
          console.error('Error updating product:', error);
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
