// import app from "./src/app.js";
const app = require("./src/app.js");
require("dotenv").config();
const connectToDB = require("./src/config/database.js");

const port = parseInt(process.env.PORT, 10) || 3000;
// const host = process.env.HOST || "0.0.0.0";

const startServer = async () => {
    try {
        await connectToDB();

        const server = app.listen(port, () => {
            console.log(`Server is running on ${port}`);
        });

        server.on("error", (error) => {
            console.error("Server failed to start:", error);
            process.exit(1);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();