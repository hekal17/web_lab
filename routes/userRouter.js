const express = require('express');
const {getAllUsers, getUserByID, newUser, updateUser, deleteUser, getUserManagers} = require('../controllers/userController');
const userRouter = express.Router();

userRouter.get('/', getAllUsers);

userRouter.get('/managers', getUserManagers);

userRouter.get('/:id', getUserByID);

userRouter.post('/', newUser);

userRouter.put('/:id', updateUser);

userRouter.delete('/:id', deleteUser);

module.exports = userRouter;