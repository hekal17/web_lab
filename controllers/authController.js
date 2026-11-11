const { db } = require('../db.js');
const { isNonEmptyString, isValidEmail, isStrongPassword, trimText } = require('../utils/validation.js');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!isNonEmptyString(username) || !isNonEmptyString(email) || typeof password !== "string" || password === "") {
        return res.status(400).json({ message: "username, email and password are required" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isStrongPassword(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters with an uppercase letter, a lowercase letter and a number" });
    }

    const query = `
        INSERT INTO USERS (USERNAME, EMAIL, PASSWORD, ROLE)
        VALUES (?, ?, ?, 'user')
    `;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(query, [trimText(username), trimText(email), hashedPassword]);

        const [users] = await db.query(
            "SELECT ID, USERNAME, EMAIL, ROLE FROM USERS WHERE ID = ?",
            [result.insertId]
        );

        return res.status(201).json({
            message: 'User registered successfully',
            data: users[0]
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!isNonEmptyString(email) || typeof password !== "string" || password === "") {
        return res.status(400).json({ message: "email and password are required" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    try {
        const [users] = await db.query(
            "SELECT * FROM USERS WHERE EMAIL = ?",
            [trimText(email)]
        );

        if (users.length === 0 || !(await bcrypt.compare(password, users[0].PASSWORD))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        return res.status(200).json({
            message: 'Login successful',
            data: {
                ID: users[0].ID,
                USERNAME: users[0].USERNAME,
                EMAIL: users[0].EMAIL,
                ROLE: users[0].ROLE
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};