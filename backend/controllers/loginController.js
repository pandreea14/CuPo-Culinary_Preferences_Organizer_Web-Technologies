const { loginUser } = require("../services/loginService");

const handleLogin = async (request, response) => {
  let body = "";

  request.on("data", (chunk) => {
    body += chunk.toString();
  });

  request.on("end", async () => {
    try {
      const { email, password } = JSON.parse(body);
      const token = await loginUser(email, password);

      if (token.error) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: token.error }));
        return;
      }
      console.log(token);

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ token: token.token }));
    } catch (error) {
      console.error("An error occurred during the login: ", error);
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Login: Internal Server Error" }));
    }
  });
};

module.exports = { handleLogin };