const express = require("express");
const { register, login, logout, getUserDetails } = require("../controller/auth.controller");
const { authUser} = require("../middleware/auth.middleware");

const authRouter = express.Router();

authRouter.post('/register', register);

authRouter.post('/login', login);

authRouter.get('/logout', logout);

authRouter.get('/user', authUser, getUserDetails);

module.exports = authRouter;