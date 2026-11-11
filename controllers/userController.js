const { db } = require('../db.js');
const { isNonEmptyString, isValidEmail, isStrongPassword, isValidId, trimText } = require('../utils/validation.js');

const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT ID, USERNAME, EMAIL, ROLE, MANAGER_ID FROM USERS"
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
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const id = Number(req.params.id);

    try {
        const [users] = await db.query(
            "SELECT ID, USERNAME, EMAIL, ROLE, MANAGER_ID FROM USERS WHERE ID = ?",
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
    const { username, email, password, role, managerId } = req.body;

    if (!isNonEmptyString(username) || !isNonEmptyString(email) || typeof password !== "string") {
        return res.status(400).json({ message: "username, email and password are required" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isStrongPassword(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters with an uppercase letter, a lowercase letter and a number" });
    }

    if (role !== undefined && role !== "admin" && role !== "user") {
        return res.status(400).json({ message: "role must be 'admin' or 'user'" });
    }

    if (managerId !== undefined && managerId !== null && !isValidId(managerId)) {
        return res.status(400).json({ message: "managerId must be a positive integer or null" });
    }

    const query = `
    INSERT INTO USERS (USERNAME, EMAIL, PASSWORD, ROLE, MANAGER_ID)
    VALUES (?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await db.query(query, [trimText(username), trimText(email), password, role ?? "user", managerId ?? null]);

        const [users] = await db.query(
            "SELECT ID, USERNAME, EMAIL, ROLE, MANAGER_ID FROM USERS WHERE ID = ?",
            [result.insertId]
        );

        return res.status(201).json({
            message: 'User created successfully',
            data: users[0]
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(409).json({ message: 'Manager does not exist' });
        }
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const deleteUser = async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const id = Number(req.params.id);

    try {
        const [users] = await db.query(
            "SELECT ID, USERNAME, EMAIL, ROLE, MANAGER_ID FROM USERS WHERE ID = ?",
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
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ message: 'User cannot be deleted because they have reviews or manage other users' });
        }
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const updateUser = async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const id = Number(req.params.id);
    const { username, email, password, role, managerId } = req.body;

    if (username === undefined && email === undefined && password === undefined && role === undefined && managerId === undefined) {
        return res.status(400).json({ message: "Provide at least one field to update" });
    }

    if (username !== undefined && !isNonEmptyString(username)) {
        return res.status(400).json({ message: "username must be a non-empty string" });
    }

    if (email !== undefined && !isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (password !== undefined && !isStrongPassword(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters with an uppercase letter, a lowercase letter and a number" });
    }

    if (role !== undefined && role !== "admin" && role !== "user") {
        return res.status(400).json({ message: "role must be 'admin' or 'user'" });
    }

    if (managerId !== undefined && managerId !== null && (!isValidId(managerId) || managerId === id)) {
        return res.status(400).json({ message: "managerId must be a positive integer (not the user's own ID) or null" });
    }

    const selectExistingUserQuery = "SELECT * FROM USERS WHERE ID = ?";

    const updateUserQuery = `
        UPDATE USERS
        SET USERNAME = ?, EMAIL = ?, PASSWORD = ?, ROLE = ?, MANAGER_ID = ?
        WHERE ID = ?
    `;

    try {
        const [existing] = await db.query(selectExistingUserQuery, [id]);

        if (existing.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const current = existing[0];

        await db.query(updateUserQuery, [
            username !== undefined ? trimText(username) : current.USERNAME,
            email !== undefined ? trimText(email) : current.EMAIL,
            password ?? current.PASSWORD,
            role ?? current.ROLE,
            managerId === undefined ? current.MANAGER_ID : managerId,
            id
        ]);

        const [users] = await db.query(
            "SELECT ID, USERNAME, EMAIL, ROLE, MANAGER_ID FROM USERS WHERE ID = ?",
            [id]
        );

        return res.json({
            message: 'User updated successfully',
            data: users[0]
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(409).json({ message: 'Manager does not exist' });
        }
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const getUserManagers = async (req, res) => {
    const query = `
        SELECT E.ID, E.USERNAME AS EmployeeName, M.USERNAME AS ManagerName
        FROM USERS E
        LEFT JOIN USERS M ON E.MANAGER_ID = M.ID
        ORDER BY E.ID
    `;

    try {
        const [managers] = await db.query(query);

        return res.status(200).json({
            status: 'success',
            results: managers.length,
            data: managers
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
    updateUser,
    getUserManagers
};