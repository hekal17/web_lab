const app = require('./index');
const PORT = 8080;
const HOSTNAME = '127.0.0.1';

app.listen(PORT, HOSTNAME, () => {
    console.log("Server running...");
});