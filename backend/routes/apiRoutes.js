const { handleRegister } = require("../controllers/registerController");
const { handleLogin } = require("../controllers/loginController");
// const { handleSearchFriend } = require("../controllers/friendsController");
// const { getFood } = require("../controllers/productController");
// const { getFavorites, addFavorites, removeFavorite } = require("../controllers/favoritesController");


module.exports = (request, response) => {
  console.log(`Received ${request.method} request at ${request.url}`);


  // if (request.method === "POST" && request.url === "/register") {
  //   handleRegister(request, response);
  // } else if (request.method === "POST" && request.url === "/login") {
  //   handleLogin(request, response);
  // } else if (request.method === "GET" && request.url === "/api/products") {
  //   getAllProducts(request, response);
  // } else if(request.method ==='POST' && request.url === "/api/searchFriend"){
  //   handleSearchFriend(request, response);
  // }
  // else {
  // const parsedUrl = new URL(request.url, `http://${request.headers.host}`); // Use the URL constructor for parsing
  // request.query = Object.fromEntries(parsedUrl.searchParams); // Convert searchParams to a plain object and attach to request

  if (request.method === "POST") {
    if (parsedUrl.pathname === "/register") {
      handleRegister(request, response);
    } else if (
      parsedUrl.pathname === "/login" ||
      parsedUrl.pathname === "/loginAdmin"
    ) {
      handleLogin(request, response);
    } else if (parsedUrl.pathname === "/api/favorites") {
      addFavorites(request, response);
    }
  } else if (request.method === "GET") {
    if (parsedUrl.pathname === "/api/food") {
      getFood(request, response);
    } else if (parsedUrl.pathname === "/api/favorites") {
      getFavorites(request, response);
    }
  } else if (request.method === "DELETE") {
    if (parsedUrl.pathname === "/api/favorites") {
      removeFavorite(request, response);
    }
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "API endpoint not found" }));
  }
};
