const fs = require("fs");

const serveStaticFile = (filePath, contentType, response) => {
  fs.readFile(filePath, (error, content) => {
    if (error) {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.write('Error: File not found');
        response.end();
    } else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.write(content);
        response.end();
    }
  });
};

module.exports = serveStaticFile;