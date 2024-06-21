const { query } = require('../utils/dbUtils');

async function searchUserByEmail(email) {
  const sql = 'SELECT email FROM users WHERE email LIKE ?';
  const params = [`${email}%`]; // Add a wildcard to match any email starting with the input

  try {
    const results = await query(sql, params);
    if (results.length === 0) {
      return { error: "User not found." };
    }

    return results;
  } catch (error) {
    console.error("Error fetching user from db:", error);
    throw error; // Rethrow or handle as needed
  }
}

module.exports = {
  searchUserByEmail,
};
