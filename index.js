const express = require('express');
const tripRouter = require('./routes/tripRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();
app.use(express.json());

app.use('/trips', tripRouter);
app.use('/users', userRouter);

module.exports = app;