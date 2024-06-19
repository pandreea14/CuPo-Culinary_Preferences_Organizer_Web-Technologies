const { handleRegister } = require("../controllers/registerController");
const { handleLogin } = require("../controllers/loginController");
const { getFood } = require("../controllers/productController");

module.exports = (request, response) => {
  console.log(`Received ${request.method} request at ${request.url}`);

  const parsedUrl = new URL(request.url, `http://${request.headers.host}`); // Use the URL constructor for parsing
  request.query = Object.fromEntries(parsedUrl.searchParams); // Convert searchParams to a plain object and attach to request

  if (request.method === "POST" && parsedUrl.pathname === "/register") {
    handleRegister(request, response);
  } else if (request.method === "POST" && (parsedUrl.pathname === "/login" || parsedUrl.pathname === "/loginAdmin")) {
    handleLogin(request, response);
  } else if (request.method === "GET" && parsedUrl.pathname === "/api/food") {
    getFood(request, response);
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "API endpoint not found" }));
  }
};
