const http = require("http");
const staticRoutes = require("./routes/staticRoutes");
const apiRoutes = require("./routes/apiRoutes");

//create the server
const server = http.createServer((request, response) => {
  if (request.method === "GET") {
    if (request.url.startsWith("/api")) {
      apiRoutes(request, response);
    } else {
      staticRoutes(request, response);
    }
  } else {
    response.writeHead(405, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Method not allowed" }));
  }
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
