const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

const server = http.createServer(function(req, res) {
    console.log(`Request for ${req.url}`);

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

    fs.readFile(filePath, function(error, data) {
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
});

function getFilePath(url) {
    if (url === '/' || url === '/login.html') {
        return path.join(__dirname, 'login.html');
    } else if (url === '/menu.html') {
        return path.join(__dirname, 'menu.html');
    } else if (url === '/register.html') {
        return path.join(__dirname, 'register.html');
    } else if (url === '/loginAdmin.html') {
        return path.join(__dirname, 'loginAdmin.html');
    } else if (url === '/login.css') {
        return path.join(__dirname, 'login.css');
    } else if (url === '/script.js') {
        return path.join(__dirname, 'script.js');
    } else if (url.startsWith('/images/')) {
        return path.join(__dirname, url);
    } else {
        return path.join(__dirname, url);
    }
}

server.listen(port, function(error) {
    if (error) {
        console.log('Something went wrong', error);
    } else {
        console.log('Server is listening on port ' + port);
    }
});