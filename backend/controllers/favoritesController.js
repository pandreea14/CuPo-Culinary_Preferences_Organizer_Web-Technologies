const {
  addFavoriteItem,
  fetchFavoriteItems,
  removeFavoriteItem
} = require("../services/favoritesService");

// adds in join table
const addFavorites = async (request, response) => {
  try {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", async () => {
      const { userEmail, foodName } = JSON.parse(body);

      // Validate email and food_name
      if (!userEmail || !foodName) {
        return response.status(400).send("Email and food name are required.");
      }

      const result = await addFavoriteItem(userEmail, foodName);
      if (result.alreadyExists) {
        response.writeHead(409, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Item already in favorites" }));
      } else {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Favorite added successfully" }));
      }
    });
  } catch (error) {
    if (error.message === "Item already in favorites") {
      response.writeHead(409, { "Content-Type": "application/json" });
    //   response.end(JSON.stringify({ error: error.message }));
    } else {
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  }
};

//for a specific user
const getFavorites = async (request, response) => {
  try {
    const userEmail = request.query.user;

    const favoriteItems = await fetchFavoriteItems(userEmail);

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(favoriteItems));
  } catch (error) {
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({ error: "Get favorites - Internal Server Error" })
    );
  }
};

const removeFavorite = async (request, response) => {
    try {
      let body = "";
      request.on("data", chunk => {
        body += chunk.toString();
      });
      request.on("end", async () => {
        const { userEmail, foodName } = JSON.parse(body);
        await removeFavoriteItem(userEmail, foodName);
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Favorite removed successfully" }));
      });
    } catch (error) {
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  };

module.exports = {
  addFavorites,
  getFavorites,
  removeFavorite
};