const { getAllProducts } = require('../controllers/productController');
const { registerUser } = require('../controllers/registerController');
//added register path
module.exports = (request, response) => {
    if (request.method === 'POST' && request.url === '/api/register') {
        registerUser(request, response);
    } else if (request.method === 'GET' && request.url === '/api/products') {
        getAllProducts(request, response);
    } else {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
};
