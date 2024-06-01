const { query } = require('../utils/dbUtils');

const fetchAllProducts = async () => {
    const sql = 'SELECT * FROM products';
    try {
        const results = await query(sql); //asteapta raspunsul de la promisiune
        return results;
    } catch (error) {
        throw new Error('Failed to fetch products from database');
    }
};

module.exports = {
    fetchAllProducts
};
