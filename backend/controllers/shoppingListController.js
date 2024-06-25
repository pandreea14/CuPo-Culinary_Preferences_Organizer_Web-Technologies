const {
  addShoppingList,
  fetchShoppingLists,
  deleteList,
  addItemToShoppingList,
  deleteItemFromList,
} = require("../services/shoppingListService");

async function handleShoppingList(request, response) {
  try {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", async () => {
      const { userEmail, listName } = JSON.parse(body);

      const result = await addShoppingList(userEmail, listName);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(result));
    });
  } catch (error) {
    console.error("Error fetching food data:", error);
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

async function getShoppingList(request, response) {
  try {
    const userEmail = request.query.user;

    const shlists = await fetchShoppingLists(userEmail);

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(shlists));
  } catch (error) {
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({ error: "Get favorites - Internal Server Error" })
    );
  }
}

async function handleDeleteList(request, response) {
  try {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", async () => {
      const { userEmail, listName } = JSON.parse(body);
      await deleteList(userEmail, listName);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "List removed successfully" }));
    });
  } catch (error) {
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

async function addItemToList(request, response) {
  try {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", async () => {
      const { userEmail, listName, foodName } = JSON.parse(body);

      const result = await addItemToShoppingList(userEmail, listName, foodName);
      if (result.error) {
        response.writeHead(409, { "Content-Type": "application/json" }); //  409 Conflict for duplicate item
      } else {
        response.writeHead(200, { "Content-Type": "application/json" });
      }
      response.end(JSON.stringify(result));
    });
  } catch (error) {
    console.error("Error fetching food data:", error);
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

async function handleDeleteItem(request, response) {
  let body = "";

  request.on("data", (chunk) => {
    body += chunk.toString();
  });

  request.on("end", async () => {
    try {
      const { userEmail, listName, foodName } = JSON.parse(body);
      console.log(
        `Received delete request for ${userEmail}'s list named ${listName}, item ${foodName}`
      );

      await deleteItemFromList(userEmail, listName, foodName);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "Item removed successfully" }));
    } catch (error) {
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
}

module.exports = {
  handleShoppingList,
  getShoppingList,
  handleDeleteList,
  addItemToList,
  handleDeleteItem,
};