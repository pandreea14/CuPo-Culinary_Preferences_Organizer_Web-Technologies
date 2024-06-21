const { query } = require('../utils/dbUtils');

async function searchUserByEmail(email) {
  const sql = 'SELECT id, email FROM users WHERE email = ?';
  const params = [email];
  const results = await query(sql, params);

  if (results.length === 0) {
    return { error: "User not found." };
  }

  return results[0]; //il returneaza pe primul gasit, e unic
}

module.exports = {
  searchUserByEmail,
};
