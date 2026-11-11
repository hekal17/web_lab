const express = require('express');
const {getAllReviews, getReviewByID, newReview, updateReview, deleteReview, getReviewDetails} = require('../controllers/reviewController');
const reviewRouter = express.Router();

reviewRouter.get('/', getAllReviews);

reviewRouter.get('/details', getReviewDetails);

reviewRouter.get('/:id', getReviewByID);

reviewRouter.post('/', newReview);

reviewRouter.put('/:id', updateReview);

reviewRouter.delete('/:id', deleteReview);

module.exports = reviewRouter;