const express = require('express');
const {getAllTrips, getTripByID, newTrip, updateTrip, deleteTrip, checkBudget, compareTrips} = require('../controllers/tripController');
const {validateBudget} = require('../utils/validateBudget')
const {verifyAdmin} = require('../utils/verifyAdmin')
const {validateTrip} = require('../utils/validateTrip')
const tripRouter = express.Router();

tripRouter.get('/', getAllTrips);

tripRouter.get('/:id', getTripByID);

tripRouter.post('/', verifyAdmin, validateTrip, newTrip);

tripRouter.put('/:id', verifyAdmin, updateTrip);

tripRouter.delete('/:id', verifyAdmin, deleteTrip);

tripRouter.post('/check-budget', validateBudget, checkBudget);

tripRouter.post('/compare-trips', compareTrips);

module.exports = tripRouter;