const { db } = require('../db.js');

const getAllTrips = async (req, res) => {
    try {
        const [trips] = await db.query("SELECT * FROM TRIPS");

        res.status(200).json({
            status: 'success',
            message: 'Trips retrieved successfully',
            results: trips.length,
            data: trips
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const getTripByID = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const [trips] = await db.query(
            "SELECT * FROM TRIPS WHERE ID = ?",
            [id]
        );

        if (trips.length === 0) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        return res.json(trips[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const newTrip = async (req, res) => {
    const { destination, cost, description } = req.body;

    if (
        typeof destination !== 'string' || !destination.trim() ||
        typeof cost !== 'number' || !Number.isFinite(cost) || cost < 0
    ) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const query = `
        INSERT INTO TRIPS (DESTINATION, COST, DESCRIPTION)
        VALUES (?, ?, ?)
    `;

    try {
        const [result] = await db.query(query, [destination.trim(), cost, description ?? null]);

        const [trips] = await db.query(
            "SELECT * FROM TRIPS WHERE ID = ?",
            [result.insertId]
        );

        return res.status(201).json({
            message: 'Trip created successfully',
            data: trips[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const updateTrip = async (req, res) => {
    const id = Number(req.params.id);
    const { destination, cost } = req.body;

    if (
        typeof destination !== 'string' || !destination.trim() ||
        typeof cost !== 'number' || !Number.isFinite(cost) || cost < 0
    ) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        const [result] = await db.query(
            "UPDATE TRIPS SET DESTINATION = ?, COST = ? WHERE ID = ?",
            [destination.trim(), cost, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const [trips] = await db.query(
            "SELECT * FROM TRIPS WHERE ID = ?",
            [id]
        );

        return res.json({
            message: 'Trip updated successfully',
            data: trips[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const deleteTrip = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const [trips] = await db.query(
            "SELECT * FROM TRIPS WHERE ID = ?",
            [id]
        );

        if (trips.length === 0) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        await db.query("DELETE FROM TRIPS WHERE ID = ?", [id]);

        return res.json({
            message: 'Trip deleted successfully',
            data: trips[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const checkBudget = async (req, res) => {
    const { budget } = req.body;

    if (typeof budget !== 'number' || !Number.isFinite(budget) || budget < 0) {
        return res.status(400).json({ message: 'budget must be a positive number' });
    }

    try {
        const [affordableTrips] = await db.query(
            "SELECT * FROM TRIPS WHERE COST <= ?",
            [budget]
        );

        return res.status(200).json(affordableTrips);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
};

const compareTrips = async (req, res) => {
    const { tripId1, tripId2 } = req.body;

    if (!Number.isInteger(tripId1) || !Number.isInteger(tripId2) || tripId1 <= 0 || tripId2 <= 0 || tripId1 === tripId2) {
        return res.status(400).json({ message: 'tripId1 and tripId2 must be two different positive integers' });
    }

    try {
        const [rows] = await db.query(
            "SELECT * FROM TRIPS WHERE ID IN (?, ?)",
            [tripId1, tripId2]
        );

        const trip1 = rows.find(t => t.ID === tripId1);
        const trip2 = rows.find(t => t.ID === tripId2);

        if (!trip1 || !trip2) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const cost1 = Number(trip1.COST);
        const cost2 = Number(trip2.COST);

        if (cost1 === cost2) {
            return res.status(200).json({
                destination1: trip1.DESTINATION,
                destination2: trip2.DESTINATION,
                costDifference: 0,
                message: 'Both trips have the same cost'
            });
        }

        const costDifference = Math.abs(cost1 - cost2);
        let cheaperDestination = trip2.DESTINATION;
        if (cost1 < cost2) {
            cheaperDestination = trip1.DESTINATION;
        }

        res.status(200).json({
            destination1: trip1.DESTINATION,
            destination2: trip2.DESTINATION,
            costDifference: costDifference,
            cheaperDestination: cheaperDestination
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Database error'
        });
    }
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