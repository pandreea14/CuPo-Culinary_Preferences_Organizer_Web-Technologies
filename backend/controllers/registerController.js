const { registerUser } = require("../services/registerService");
const bcrypt = require("bcrypt");

const handleRegister = async (request, response) => {
  let body = '';

  request.on('data', (chunk) => {
    body += chunk.toString(); // Convert binary data to string
  });

  request.on('end', async () => {
    try {
      const { email, password } = JSON.parse(body);
      console.log('body is' + body);

      const hashedPassword = await bcrypt.hash(password, 10);
      await registerUser(email, hashedPassword);

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify({ message: response.message })
      );
    } catch (error) {
      console.error("Error inserting data into the database:", error);
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Register: Internal Server Error" }));
    }
  });
};

module.exports = { handleRegister };
