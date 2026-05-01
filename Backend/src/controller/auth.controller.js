const userModel = require("../model/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../model/blacklist.model.js");
require("dotenv").config();

const register = async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Register request received with username: ", username, " email: ", email, " and password: ", password);
    try {
        if (!username || !email || !password) {
            return res.status(400).json("All fields are required");
        }
        const userExists = await userModel.findOne({
            $or: [{ username }, { email }]
        });
        if (userExists) {
            return res.status(400).json({
                message: 'Account already exist with this email or username'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ username, email, password: hashedPassword });
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        res.cookie("token", token);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (err) {
        console.log("Auth controller register error: ", err);
        res.status(500).json("Internal server error");
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login request received with email: ", email, " and password: ", password);
        if(!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        res.cookie("token", token);
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    }
    catch (err) {
        console.log(`Auth controller login error: ${err}`);
        res.status(500).json({ message: "Internal server error" })
    }
};

const logout = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }
    const blacklist = await blacklistModel.create({ token });
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
}

const getUserDetails = async (req, res) => {
    const user = await userModel.findById(req.user.id);

    return res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email
    })
}

module.exports = { register, login, logout, getUserDetails };