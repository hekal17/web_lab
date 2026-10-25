const express = require('express');
const tripRouter = require('./routes/tripRouter.js')
const userRouter = require('./routes/userRouter.js')

const app = express();
app.use(express.json());

app.use('/trips', tripRouter);
app.use('/users', userRouter);

module.exports = app;