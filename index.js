const express = require('express');
const tripRouter = require('./routes/tripRouter')
const userRouter = require('./routes/userRouter')

const app = express();
app.use(express.json());

app.use('/trips', tripRouter);
app.use('/users', userRouter);

module.exports = app;