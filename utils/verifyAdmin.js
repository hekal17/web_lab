const verifyAdmin = (req, res, next) => {
    const role = req.headers['role'];

    if (role === "admin") {
        return next;
}

res.status(403).json({ message: "Admin access required" });
};

module.exports = {
    verifyAdmin
}