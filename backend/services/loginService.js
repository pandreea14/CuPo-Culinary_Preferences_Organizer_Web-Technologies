const { query } = require('../utils/dbUtils');
const bcrypt = require('bcrypt');


async function getUserByEmail(email) {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const params = [email];
  const results = await query(sql, params);

  if (results.length === 0) {
    return { error: "User not found. Please register first." };
  }

  return results[0];//daca a gasit emailul returneaza primul obiect(user) gasit si singurul de altfel
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
    const user = await getUserByEmail(email);

    if (user.error) {
      return user;
    }

    const passwordMatch = await comparePasswords(password, user.password);

    if (passwordMatch.error) {
      return passwordMatch;
    }

    //generate token upon successful login
    return { message: 'Login successful' };
  } catch (error) {
    console.error("An error occurred during the login: ", error);
    return { error: "An error occurred during the login: " + error.message };
  }
}

module.exports = { loginUser, getUserByEmail };
