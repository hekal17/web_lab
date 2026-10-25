const mysql = require("mysql2/promise")

const db = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Miata2003!",
    database: "travel"
})

const createTripTable = `
    CREATE TABLE IF NOT EXISTS TRIPS (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        DESTINATION VARCHAR(255) NOT NULL,
        COUNTRY VARCHAR(255) NOT NULL,
        COST DECIMAL(10,2) NOT NULL,
        DESCRIPTION TEXT DEFAULT ('N/A')
    )
`;

module.exports = {
    db,
    createTripTable
}