const { db } = require('../db.js');

const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT ID, USERNAME, EMAIL, ROLE FROM USERS"
        );

        res.status(200).json({
            status: 'success',
            message: 'Users retrieved successfully',
            results: users.length,
            data: users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const getUserByID = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const [users] = await db.query(
            "SELECT ID, USERNAME, EMAIL, ROLE FROM USERS WHERE ID = ?",
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(users[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const newUser = async (req, res) => {
    const {username, email, password, role} = req.body;
    
    if (typeof username !== "string" || username.trim() === "" || typeof email !== "string" || email.trim() === "" || typeof password !== "string" || password.trim() === "") {
        return res.status(400).json({ error: "username and password are required" });
};

    if (role !== undefined && role !== "admin" && role !== "user") {
        return res.status(400).json({ error: "role must be 'admin' or 'user'" });
}

    const query = `
    INSERT INTO USERS (USERNAME, EMAIL, PASSWORD, ROLE)
    VALUES (?, ?, ?, ?)
    `;

    try {
        const [result] = await db.query(query, [username, email, password, role ?? "user"]);

        const [users] = await db.query(
            "SELECT ID, USERNAME, EMAIL, ROLE FROM USERS WHERE ID = ?",
            [result.insertId]
        );

        return res.status(201).json({
            message: 'User created successfully',
            data: users[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Database error'
        })
    }
};

const deleteUser = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const [users] = await db.query(
            "SELECT ID, USERNAME, EMAIL, ROLE FROM USERS WHERE ID = ?",
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        await db.query("DELETE FROM USERS WHERE ID = ?", [id]);

        return res.json({
            message: 'User deleted successfully',
            data: users[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const updateUser = async (req, res) => {
    const id = Number(req.params.id);
    const { username, email, password, role } = req.body;

    if (username !== undefined && (typeof username !== "string" || username.trim() === "")) {
        return res.status(400).json({ error: "username must be a non-empty string" });
    }

    if (email !== undefined && (typeof email !== "string" || email.trim() === "")) {
        return res.status(400).json({ error: "email must be a non-empty string" });
    }

    if (password !== undefined && (typeof password !== "string" || password.trim() === "")) {
        return res.status(400).json({ error: "password must be a non-empty string" });
    }

    if (role !== undefined && role !== "admin" && role !== "user") {
        return res.status(400).json({ error: "role must be 'admin' or 'user'" });
    }

    const selectExistingUserQuery = "SELECT * FROM USERS WHERE ID = ?";

    const updateUserQuery = `
        UPDATE USERS
        SET USERNAME = ?, EMAIL = ?, PASSWORD = ?, ROLE = ?
        WHERE ID = ?
    `;

    try {
        const [existing] = await db.query(selectExistingUserQuery, [id]);

        if (existing.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const current = existing[0];

        await db.query(updateUserQuery, [
            username ?? current.USERNAME,
            email ?? current.EMAIL,
            password ?? current.PASSWORD,
            role ?? current.ROLE,
            id
        ]);

        const [users] = await db.query(
            "SELECT ID, USERNAME, EMAIL, ROLE FROM USERS WHERE ID = ?",
            [id]
        );

        return res.json({
            message: 'User updated successfully',
            data: users[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

module.exports = {
    getAllUsers,
    getUserByID,
    newUser,
    deleteUser,
    updateUser
};