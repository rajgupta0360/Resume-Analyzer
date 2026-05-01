const jwt = require("jsonwebtoken");
const blacklistModel = require("../model/blacklist.model.js");
require("dotenv").config();

async function authUser(req, res, next) {
    const token = req.cookies.token;
    console.log("authUser middleware token:", token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const isTokenBlacklisted = await blacklistModel.findOne({ token });

    if (isTokenBlacklisted) {
        return res.status(401).json({ message: "Unauthorized: Token is invalid" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = {authUser};