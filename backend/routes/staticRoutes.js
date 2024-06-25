const staticController = require("../controllers/staticController");

module.exports = (request, response) => {
  const staticFilePaths = {
    "/": "login.html",
    "/login": "login.html",
    "/register": "register.html",
    "/menu": "menu.html",
    "/menuAdmin": "menuAdmin.html",
    "/menu/friends": "friends.html",
    "/menu/favorites": "favorites.html",
    "/menu/shoppinglist": "shoppinglist.html",
    "/menu/statistics": "statistics.html",
    "/menu/profile": "profile.html",
    "/menuAdmin/shoppinglist": "shoppinglist.html",
    "/menuAdmin/statistics": "statistics.html",
    "/menuAdmin/favorites": "favorites.html",
    "/menuAdmin/friends": "friends.html",
    "/menuAdmin/admin": "admin.html",
  };

  if (staticFilePaths[request.url]) {
    staticController.serveHtmlFile(staticFilePaths[request.url], response);
  } else if (request.url.startsWith("/css/")) {
    staticController.serveCssFile(request.url, response);
  } else if (request.url.startsWith("/js/")) {
    staticController.serveJsFile(request.url, response);
  } else if (request.url.startsWith("/images/")) {
    staticController.serveImageFile(request.url, response);
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Endpoint not found" }));
  }
};
