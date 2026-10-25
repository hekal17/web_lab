const users = require('../models/userModel.js');

const getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Users retrieved successfully',
        results: users.length,
        data: users
    });
};

const getUserByID = (req, res) => {
    
    const id = Number(req.params.id);
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            return res.send(users[i]);
        };
    };
    res.status(404).json({ message: 'User not found'});
};

const newUser = (req, res) => {
    const {username, password} = req.body;
    const newUser = {
        id : users.length + 1,
        username : username,
        password : password
    };
    users.push(newUser);
    res.status(201).json(newUser);
};

const deleteUser = (req, res) => {
    
    const id = Number(req.params.id);

    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            const deleted = users.splice(i, 1); // new array for deleted users
            return res.send(deleted[0]);
        };
    };
    res.status(404).json({ message: 'User not found'});
};

const updateUser = (req, res) => {
    
    const id = Number(req.params.id);
    const {username, password} = req.body;

    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            users[i].username = username;
            users[i].password = password;
            return res.send(users[i]);
        };
    };
    res.status(404).json({ message: 'User not found'});
};

module.exports = {
    getAllUsers,
    getUserByID,
    newUser,
    deleteUser,
    updateUser
};