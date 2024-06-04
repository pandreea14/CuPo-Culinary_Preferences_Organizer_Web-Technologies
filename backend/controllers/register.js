const { query } = require('../utils/dbUtils');

const registerUser = async (request, response) => {
    let body = '';

    request.on('data', chunk => {
        body += chunk.toString(); // Convert binary data to string
    });

    request.on('end', async () => {
        try {
            const { email, password } = JSON.parse(body); // Parse the string to JSON
            const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
            await query(sql, [email, password]);

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: 'User registered successfully' }));
        } catch (error) {
            console.error('Error inserting data into the database:', error);
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    });
};

module.exports = { registerUser };
