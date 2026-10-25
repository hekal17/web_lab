const express = require('express');
const {getAllTrips, getTripByID, newTrip, updateTrip, deleteTrip, checkBudget} = require('../controllers/tripController.js');
const {validateBudget} = require('../utils/middlewares.js')
const tripRouter = express.Router();

tripRouter.get('/', getAllTrips);

tripRouter.get('/:id', getTripByID);

tripRouter.post('/', newTrip);

tripRouter.put('/:id', updateTrip);

tripRouter.delete('/:id', deleteTrip);

tripRouter.post('/check-budget', validateBudget, checkBudget);

module.exports = tripRouter;