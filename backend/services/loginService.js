const { query } = require("../utils/dbUtils");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwtUtils");

async function getUserByEmail(email) {
  const sql = "SELECT * FROM users WHERE email = ? AND role = 'user'";
  const params = [email];
  const results = await query(sql, params);

  if (results.length === 0) {
    return { error: "User not found. Please register first." };
  }

  return results[0]; //daca a gasit emailul returneaza primul obiect(user) gasit si singurul de altfel
}

async function getAdminByEmail(email) {
  const sql = "SELECT * FROM users WHERE email = ? AND role = 'admin'";
  const params = [email];
  const results = await query(sql, params);

  if (results.length === 0) {
    return { error: "Admin not found." };
  }

  return results[0]; //daca a gasit emailul returneaza primul obiect(user) gasit si singurul de altfel
}

async function comparePasswords(inputPassword, storedPassword) {
  const passwordMatch = await bcrypt.compare(inputPassword, storedPassword);

  if (!passwordMatch) {
    return { error: "Invalid password." };
  }

  return true;
}

async function loginUser(email, password) {
  try {
    let user = await getUserByEmail(email);
    if (user.error) {
      user = await getAdminByEmail(email);
      if (user.error) {
        return { error: "User not found. Please register first." };
      }
    }

    const passwordMatch = await comparePasswords(password, user.password);
    if (passwordMatch.error) {
      return passwordMatch;
    }

    //generate token upon successful login
    console.log("email: ", user.email);
    console.log("role: ", user.role);
    const token = generateToken({ email: user.email, role: user.role });
    // return { token };
    return { message: "User logged in!", token };

  } catch (error) {
    console.error("Error in login service: ", error);
    return { error: "Error in login service: " + error.message };
  }
}

module.exports = { loginUser, getUserByEmail, getAdminByEmail, };
