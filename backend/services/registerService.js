const { query } = require("../utils/dbUtils");
const { getUserByEmail } = require("./loginService");

const registerUser = async (email, password) => {
  if (typeof email !== "string" || typeof password !== "string") {
    console.error("Email and password must be strings");
    return { error: "Email and password must be strings" };
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser && !existingUser.error) {
    console.error("Email already in use");
    return { error: "Email already in use" };
  }

  const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
  const params = [email, password];

  try {
    const results = await query(sql, params);
    console.log("User registered successfully. User ID is: ", results.insertId);
    return { message: "User registered successfully", userId: results.insertId };
  } catch (error) {
    console.error("Error inserting data into the database:", error);
    return { error: "Register: Internal Server Error" };
  }
};

module.exports = { registerUser };