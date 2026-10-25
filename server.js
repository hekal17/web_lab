const app = require('./index');
const { db, createTripTable } = require('./db.js')

const PORT = 8080;
const HOSTNAME = '127.0.0.1';

async function startServer() {
    try {
        await db.query(createTripTable);
        console.log('Trips table created or already exists.');

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