const { getAllProducts } = require("../controllers/productController");

module.exports = (request, response) => {
  if (request.url === "/api/products") {
    getAllProducts(request, response);
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "API endpoint not found" }));
  }
};
