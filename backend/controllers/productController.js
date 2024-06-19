const { fetchFoodsByCategory } = require("../services/productService");

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
    console.error('Error fetching food data:', error);
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

module.exports = {
  getFood
};
