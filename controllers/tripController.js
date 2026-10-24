const trips = require('../models/tripModel');

const getAllTrips = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Trips retrieved successfully',
        results: trips.length,
        data: trips
    });
};

const getTripByID = (req, res) => {
    
    const id = Number(req.params.id);
    for (let i = 0; i < trips.length; i++) {
        if (trips[i].id === id) {
            return res.send(trips[i]);
        };
    };
    res.status(404).json({ message: 'Trip not found'});
};

const newTrip = (req, res) => {
    const {destination, cost} = req.body;
    const newTrip = {
        id : trips.length + 1,
        destination : destination,
        cost : cost
    };
    trips.push(newTrip);
    res.status(201).json(newTrip);
};

const updateTrip = (req, res) => {
    
    const id = Number(req.params.id);
    const {destination, cost} = req.body;

    for (let i = 0; i < trips.length; i++) {
        if (trips[i].id === id) {
            trips[i].destination = destination;
            trips[i].cost = cost;
            return res.send(trips[i]);
        };
    };
    res.status(404).json({ message: 'Trip not found'});
};

const deleteTrip = (req, res) => {
    
    const id = Number(req.params.id);

    for (let i = 0; i < trips.length; i++) {
        if (trips[i].id === id) {
            const deleted = trips.splice(i, 1); // new array for deleted trips
            return res.send(deleted[0]);
        };
    };
    res.status(404).json({ message: 'Trip not found'});
};

const checkBudget = (req, res) => {
    const { budget } = req.body;
    const afforableTrips = []
    for (let i = 0; i < trips.length; i++) {
        if (trips[i].cost <= budget) {
            afforableTrips.push(trips[i]);
        }
    }
    return res.status(200).json(afforableTrips);
}

const compareTrips = (req, res) => {
    const { tripId1, tripId2 } = req.body;

    if (!Number.isInteger(tripId1) || !Number.isInteger(tripId2) || tripId1 <= 0 || tripId2 <= 0 || tripId1 === tripId2) {
        return res.status(400).json({ message: 'tripId1 and tripId2 must be two different positive integers' });
    }

    let trip1 = null;
    let trip2 = null;

    for (let i = 0; i < trips.length; i++) {
        if (trips[i].id === tripId1) {
            trip1 = trips[i];
        }
        if (trips[i].id === tripId2) {
            trip2 = trips[i];
        }
    }
    if (!trip1 || !trip2) {
        return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip1.cost === trip2.cost) {
        return res.status(200).json({
            destination1: trip1.destination,
            destination2: trip2.destination,
            costDifference: 0,
            message: 'Both trips have the same cost'
        });
    }

    const costDifference = Math.abs(trip1.cost - trip2.cost);
    let cheaperDestination = trip2.destination;
    if (trip1.cost < trip2.cost) {
        cheaperDestination = trip1.destination;
    }

    res.status(200).json({
        destination1: trip1.destination,
        destination2: trip2.destination,
        costDifference: costDifference,
        cheaperDestination: cheaperDestination
    });
};

module.exports = { 
    getAllTrips,
    getTripByID,
    newTrip,
    updateTrip,
    deleteTrip,
    checkBudget,
    compareTrips
};