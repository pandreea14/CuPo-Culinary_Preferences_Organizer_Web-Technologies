const { getAllProducts } = require("../controllers/productController");
const { handleRegister } = require("../controllers/registerController");
const { handleLogin } = require("../controllers/loginController");
const { handleSearchFriend } = require("../controllers/friendsController");

module.exports = (request, response) => {
  console.log(`Received ${request.method} request at ${request.url}`);

  if (request.method === "POST" && request.url === "/register") {
    handleRegister(request, response);
  } else if (request.method === "POST" && request.url === "/login") {
    handleLogin(request, response);
  } else if (request.method === "GET" && request.url === "/api/products") {
    getAllProducts(request, response);
  } else if(request.method ==='POST' && request.url === "/api/searchFriend"){
    handleSearchFriend(request, response);
  }
  else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "API endpoint not found" }));
  }
};
