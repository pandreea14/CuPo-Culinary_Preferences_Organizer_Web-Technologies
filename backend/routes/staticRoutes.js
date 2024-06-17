const staticController = require("../controllers/staticController");

module.exports = (request, response) => {
  const staticFilePaths = {
    "/": "login.html",
    "/login": "login.html",
    "/register": "register.html",
    "/menu": "menu.html",
    "/admin": "admin.html",
    "/menuAdmin": "menuAdmin.html",
    "/loginAdmin": "loginAdmin.html",
    "/friends": "friends.html",
    "/favorites": "favorites.html",
    "/shoppinglist": "shoppinglist.html",
    "/statistics": "statistics.html",
    "/profile": "profile.html",
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
