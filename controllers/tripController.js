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

module.exports = {
    getAllTrips,
    getTripByID,
    newTrip,
    updateTrip,
    deleteTrip,
    checkBudget
};