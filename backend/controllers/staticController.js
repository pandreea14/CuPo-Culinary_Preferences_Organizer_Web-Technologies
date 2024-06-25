const path = require("path");
const serveStaticFile = require("../utils/serveStaticFile");

const serveHtmlFile = (fileName, response) => {
  const filePath = path.join(__dirname, "../public/html", fileName);
  serveStaticFile(filePath, "text/html", response);
};

const serveCssFile = (filePath, response) => {
  serveStaticFile(
    path.join(__dirname, "../public", filePath),
    "text/css",
    response
  );
};

const serveJsFile = (filePath, response) => {
  serveStaticFile(
    path.join(__dirname, "../public", filePath),
    "application/javascript",
    response
  );
};

const serveImageFile = (filePath, response) => {
  serveStaticFile(
    path.join(__dirname, "../public", filePath),
    "image/jpeg",
    response
  );
};

module.exports = {
  serveHtmlFile,
  serveCssFile,
  serveJsFile,
  serveImageFile,
};