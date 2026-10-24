const express = require('express');
const {getAllTrips, getTripByID, newTrip, updateTrip, deleteTrip, checkBudget} = require('../controllers/tripController');
const {validateBudget} = require('../utils/validateBudget')
const {verifyAdmin} = require('../utils/verifyAdmin')
const tripRouter = express.Router();

tripRouter.get('/', getAllTrips);

tripRouter.get('/:id', getTripByID);

tripRouter.post('/', verifyAdmin, newTrip);

tripRouter.put('/:id', verifyAdmin, updateTrip);

tripRouter.delete('/:id', verifyAdmin, deleteTrip);

tripRouter.post('/check-budget', validateBudget, checkBudget);

module.exports = tripRouter;