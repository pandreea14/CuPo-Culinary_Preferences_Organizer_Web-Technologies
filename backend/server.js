const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const mysql = require('mysql');

const port = process.env.PORT || 5500;

// MySQL connection configuration
const db = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "1234",
    database: "cupo"
});

// Connect to the database
db.connect(function (err) {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as ID', db.threadId);
});

// Function to get the file path
function getFilePath(url) {
    const baseDir = path.join(__dirname, '..');
    if (url === '/' || url === '/login.html') {
        return path.join(baseDir, 'login.html');
    } else if (url === '/menu.html') {
        return path.join(baseDir, 'menu.html');
    } else if (url === '/register.html') {
        return path.join(baseDir, 'register.html');
    } else if (url === '/loginAdmin.html') {
        return path.join(baseDir, 'loginAdmin.html');
    } else if (url === '/admin.html') {
        return path.join(baseDir, 'admin.html');
    } else if (url === '/script.js') {
        return path.join(baseDir, 'script.js');
    } else if (url.startsWith('/images/')) {
        return path.join(baseDir, url);
    } else {
        return path.join(baseDir, url);
    }
}

// Create server
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '../register') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const parsedBody = querystring.parse(body);
            const { id, email, password } = parsedBody;

            if (!id || !email || !password) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'text/plain');
                res.end('All fields are required!');
                return;
            }

            const qry = `INSERT INTO users (id, email, password) VALUES(?,?,?);`;
            const data = [id, email, password];

            db.query(qry, data, (err, result) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Error inserting record');
                    return;
                }

                console.log("New Record inserted successfully");
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('New Record inserted successfully');
            });
        });
    } else if (req.method === 'GET') {
        const filePath = getFilePath(req.url);
        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml'
        };
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, data) => {
            if (error) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('Error: File not found');
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.write(data);
                res.end();
            }
        });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
