const { fetchAllProducts } = require("../services/productService");

const getAllProducts = async (request, response) => {
  try {
    const products = await fetchAllProducts(); //asteapta promisiunea
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(products));
  } catch (error) {
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

module.exports = {
  getAllProducts,
};
