const { handleRegister } = require("../controllers/registerController");
const { handleLogin } = require("../controllers/loginController");
const { getFood, getResult } = require("../controllers/productController");
const { getFavorites, addFavorites, removeFavorite } = require("../controllers/favoritesController");
const { handleSearchFriend, handleAddFriend } = require("../controllers/friendsController");
const { handleShoppingList, getShoppingList, handleDeleteList, addItemToList } = require("../controllers/shoppingListController");

module.exports = (request, response) => {
  console.log(`Received ${request.method} request at ${request.url}`);

  const parsedUrl = new URL(request.url, `http://${request.headers.host}`); // Use the URL constructor for parsing
  request.query = Object.fromEntries(parsedUrl.searchParams); // Convert searchParams to a plain object and attach to request

  if (request.method === "POST") {
    if (parsedUrl.pathname === "/register") {
      handleRegister(request, response);
    } else if (
      parsedUrl.pathname === "/login") {
      handleLogin(request, response);
    } else if (parsedUrl.pathname === "/api/favorites") {
      addFavorites(request, response);
    } else if (parsedUrl.pathname === "/api/createShoppingList") {
      handleShoppingList(request, response);
    } else if (parsedUrl.pathname === "/api/shoppingList") {
      addItemToList(request, response);
    } else if (parsedUrl.pathname === "/api/addFriend") {
      handleAddFriend(request, response);
    }
  } else if (request.method === "GET") {
    if (parsedUrl.pathname === "/api/food") {
      getFood(request, response);
    } else if (parsedUrl.pathname === "/api/favorites") {
      getFavorites(request, response);
    } else if(parsedUrl.pathname=== "/api/searchFriend"){
      handleSearchFriend(request, response);
    } else if (parsedUrl.pathname === "/api/shoppingList") {
      getShoppingList(request, response);
    } else if (request.url.startsWith("/api/searchFilter")) {
      getResult(request, response);
    }
  } else if (request.method === "DELETE") {
    if (parsedUrl.pathname === "/api/favorites") {
      removeFavorite(request, response);
    } else if (parsedUrl.pathname === "/api/shoppingList") {
      handleDeleteList(request, response);
    }
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "API endpoint not found" }));
  }
};