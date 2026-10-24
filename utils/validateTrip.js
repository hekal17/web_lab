const validateTrip = (req, res, next) => {
    const { destination, cost } = req.body;

    if (typeof cost != "number" || cost <= 0 || !Number.isFinite(cost) || typeof destination != "string" || destination.trim() === "") {
        return res.status(400).json({ message: "Please provide a valid destination and cost"});
    }
    
    next();
};

module.exports = {
    validateTrip
}