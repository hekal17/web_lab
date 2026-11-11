require('dotenv').config();
const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const createUserTable = `
    CREATE TABLE IF NOT EXISTS USERS (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        USERNAME VARCHAR(255) NOT NULL,
        EMAIL VARCHAR(255) UNIQUE NOT NULL,
        PASSWORD VARCHAR(255) NOT NULL,
        ROLE ENUM('admin','user') NOT NULL DEFAULT 'user',
        MANAGER_ID INT NULL,
        FOREIGN KEY (MANAGER_ID) REFERENCES USERS(ID)
    )
`;

const createTripTable = `
    CREATE TABLE IF NOT EXISTS TRIP (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        DESTINATION VARCHAR(255) NOT NULL,
        COUNTRY VARCHAR(255) NOT NULL,
        COST DECIMAL(10,2) NOT NULL,
        DESCRIPTION TEXT DEFAULT ('N/A')
    )
`;

const createReviewTable = `
    CREATE TABLE IF NOT EXISTS REVIEW (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        USER_ID INT NOT NULL,
        TRIP_ID INT NOT NULL,
        RATING INT NOT NULL CHECK (RATING BETWEEN 1 AND 5),
        FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
        FOREIGN KEY (TRIP_ID) REFERENCES TRIP(ID),
        UNIQUE (USER_ID, TRIP_ID)
    )
`;

const insertUsers = `
    INSERT INTO USERS (ID, USERNAME, EMAIL, PASSWORD, ROLE, MANAGER_ID) VALUES
        (1, 'alice_boss', 'alice@example.com', 'Alice123!', 'admin', NULL),
        (2, 'bob_agent', 'bob@example.com', 'Bob12345!', 'user', 1),
        (3, 'carol_agent', 'carol@example.com', 'Carol123!', 'user', 1),
        (4, 'dave_traveler', 'dave@example.com', 'Dave1234!', 'user', 2)
`;

const insertTrips = `
    INSERT INTO TRIP (ID, DESTINATION, COUNTRY, COST) VALUES
        (1, 'Paris', 'France', 1200.00),
        (2, 'Tokyo', 'Japan', 2500.00),
        (3, 'Cairo', 'Egypt', 800.00),
        (4, 'Rome', 'Italy', 950.00)
`;

const insertReviews = `
    INSERT INTO REVIEW (USER_ID, TRIP_ID, RATING) VALUES
        (1, 1, 5),
        (2, 1, 4),
        (3, 2, 3),
        (4, 3, 5)
`;

module.exports = {
    db,
    createUserTable,
    createTripTable,
    createReviewTable,
    insertUsers,
    insertTrips,
    insertReviews
}