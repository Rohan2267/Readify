const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // console.log("🔹 Received Token:", token); // Debugging

    if ( token == null ){
        
        return res.status(401).json({ message : "Authentication token required"});
    }

    jwt.verify(token, "bookStore123", (err, user) => {
        if (err) {
            // console.log("❌ Token Verification Failed:", err.message);
            return res.status(403).json({ message: "Token expired. Please signIN again"});
        }
        // console.log("✅ Token Verified Successfully:", user);
        req.user = user;
        next();
    });

};

module.exports = { authenticateToken};