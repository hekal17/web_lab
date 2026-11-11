const express = require('express');
const authRouter = require('./routes/authRouter.js')
const tripRouter = require('./routes/tripRouter.js')
const userRouter = require('./routes/userRouter.js')
const reviewRouter = require('./routes/reviewRouter.js')

const app = express();
app.use(express.json());

app.use('/auth', authRouter);
app.use('/trips', tripRouter);
app.use('/users', userRouter);
app.use('/reviews', reviewRouter);

module.exports = app;