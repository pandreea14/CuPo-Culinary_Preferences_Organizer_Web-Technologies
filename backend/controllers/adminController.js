const { query } = require('../utils/dbUtils');

const getUsers = async (req, res) => {
    console.log('getUsers called');
    try {
        const users = await query('SELECT id, email, role FROM users');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } catch (error) {
        console.error('Error fetching users:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
};

const deleteUser = async (req, res, userId) => {
    console.log(`deleteUser called for userId: ${userId}`);
    try {
        await query('DELETE FROM users WHERE id = ?', [userId]);
        console.log(`User with ID: ${userId} deleted successfully.`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `User with ID: ${userId} deleted successfully.` }));
    } catch (error) {
        console.error('Error deleting user:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
};

const updateUserRole = async (req, res, userId) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { role } = JSON.parse(body);

        try {
            await query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
            console.log(`User with ID: ${userId} role updated to ${role} successfully.`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `User with ID: ${userId} role updated to ${role} successfully.` }));
        } catch (error) {
            console.error('Error updating user role:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    });
};

module.exports = {
    getUsers,
    deleteUser,
    updateUserRole
};
