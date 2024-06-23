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

module.exports = {
  getFood,
  getResult,
};
