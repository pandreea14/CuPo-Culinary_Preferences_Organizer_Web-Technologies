const { loginUser } = require("../services/loginService");
const { generateToken } = require("../utils/jwtUtils");

const handleLogin = async (request, response) => {
  let body = "";

  request.on("data", (chunk) => {
    body += chunk.toString(); // Convert binary data to string
  });

  request.on("end", async () => {
    try {
      
      const { email, password } = JSON.parse(body); // Parse the string to JSON
      const result = await loginUser(email, password);

      if (result.error) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: result.error }));
        return;
      }

      response.writeHead(200, { "Content-Type": "application/json" });
      const token = generateToken({ email: result.email,  role: result.role});
      response.end(JSON.stringify({ token }));

      //   response.end(
      //     JSON.stringify({ message: result.message, token: result.token })
      //   );
    } catch (error) {
      console.error("An error occurred during the login: ", error);
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Login: Internal Server Error" }));
    }
  });
};

module.exports = { handleLogin };
