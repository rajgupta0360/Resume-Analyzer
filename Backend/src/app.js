const express = require("express");
const authRouter = require("./route/auth.route");
const interviewRouter = require("./route/interview.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true // Allow cookies to be sent with requests
}));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;