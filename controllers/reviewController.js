const { db } = require('../db.js');
const { isValidId, isValidRating } = require('../utils/validation.js');

const getAllReviews = async (req, res) => {
    try {
        const [reviews] = await db.query("SELECT * FROM REVIEW");

        res.status(200).json({
            status: 'success',
            message: 'Reviews retrieved successfully',
            results: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const getReviewByID = async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const id = Number(req.params.id);

    try {
        const [reviews] = await db.query(
            "SELECT * FROM REVIEW WHERE ID = ?",
            [id]
        );

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        return res.json(reviews[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const newReview = async (req, res) => {
    const { userId, tripId, rating } = req.body;

    if (!isValidId(userId) || !isValidId(tripId) || !isValidRating(rating)) {
        return res.status(400).json({ message: 'userId and tripId must be positive integers and rating must be an integer from 1 to 5' });
    }

    const query = `
        INSERT INTO REVIEW (USER_ID, TRIP_ID, RATING)
        VALUES (?, ?, ?)
    `;

    try {
        const [result] = await db.query(query, [Number(userId), Number(tripId), rating]);

        const [reviews] = await db.query(
            "SELECT * FROM REVIEW WHERE ID = ?",
            [result.insertId]
        );

        return res.status(201).json({
            message: 'Review created successfully',
            data: reviews[0]
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'This user has already reviewed this trip' });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(409).json({ message: 'User or trip does not exist' });
        }
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const updateReview = async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const id = Number(req.params.id);
    const { rating } = req.body;

    if (!isValidRating(rating)) {
        return res.status(400).json({ message: 'rating must be an integer from 1 to 5' });
    }

    try {
        const [result] = await db.query(
            "UPDATE REVIEW SET RATING = ? WHERE ID = ?",
            [rating, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const [reviews] = await db.query(
            "SELECT * FROM REVIEW WHERE ID = ?",
            [id]
        );

        return res.json({
            message: 'Review updated successfully',
            data: reviews[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const deleteReview = async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const id = Number(req.params.id);

    try {
        const [reviews] = await db.query(
            "SELECT * FROM REVIEW WHERE ID = ?",
            [id]
        );

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await db.query("DELETE FROM REVIEW WHERE ID = ?", [id]);

        return res.json({
            message: 'Review deleted successfully',
            data: reviews[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const getReviewDetails = async (req, res) => {
    const query = `
        SELECT REVIEW.ID, USERS.USERNAME, TRIP.DESTINATION, REVIEW.RATING
        FROM REVIEW
        INNER JOIN USERS ON REVIEW.USER_ID = USERS.ID
        INNER JOIN TRIP ON REVIEW.TRIP_ID = TRIP.ID
        ORDER BY REVIEW.ID
    `;

    try {
        const [details] = await db.query(query);

        return res.status(200).json({
            status: 'success',
            results: details.length,
            data: details
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

module.exports = {
    getAllReviews,
    getReviewByID,
    newReview,
    updateReview,
    deleteReview,
    getReviewDetails
};