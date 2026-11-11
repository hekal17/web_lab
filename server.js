require('dotenv').config();
const app = require('./index');
const {db, createUserTable, createTripTable, createReviewTable, insertUsers, insertTrips, insertReviews} = require('./db.js')

const PORT = process.env.PORT || 8080;
const HOSTNAME = '127.0.0.1';

async function startServer() {
    try {
        await db.query(createUserTable);
        console.log('Users table created or already exists.');

        await db.query(createTripTable);
        console.log('Trips table created or already exists.');

        await db.query(createReviewTable);
        console.log('Reviews table created or already exists.');

        const [users] = await db.query('SELECT COUNT(*) AS count FROM USERS');
        if (users[0].count === 0) {
            await db.query(insertUsers);
            console.log('Test users inserted.');
        }

        const [trips] = await db.query('SELECT COUNT(*) AS count FROM TRIP');
        if (trips[0].count === 0) {
            await db.query(insertTrips);
            console.log('Test trips inserted.');
        }

        const [reviews] = await db.query('SELECT COUNT(*) AS count FROM REVIEW');
        if (reviews[0].count === 0) {
            await db.query(insertReviews);
            console.log('Test reviews inserted.');
        }

        app.listen(PORT, HOSTNAME, () => {
            console.log("Server running...");
        });
    } catch (error) {
        console.error('Error initializing the database:', error);
        process.exitCode = 1;
        await db.end();
    }
}

startServer();