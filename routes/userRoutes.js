const express = require('express');
const {getAllUsers, getUserByID, newUser, deleteUser} = require('../controllers/userController');
const userRouter = express.Router();

userRouter.get('/', getAllUsers);

userRouter.get('/:id', getUserByID);

userRouter.post('/', newUser);

userRouter.delete('/:id', deleteUser);

module.exports = userRouter;