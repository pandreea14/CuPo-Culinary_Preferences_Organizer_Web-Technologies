const dbConfig = {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "1234",
    database: "cupo",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

module.exports = {
    dbConfig
};