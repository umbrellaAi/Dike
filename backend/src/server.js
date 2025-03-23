import express from "express";
import connectDB from "./db/index.js";
// import { errorHandler } from "./middleware/errors.middleware.js";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Replace __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Creating express instance
const app = express();

// Setting URL encoded and payload limit
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "5mb" }));

// Setting the CORS policy
app.use(cors());

// Start the server
const majorNodeVersion = parseInt(process.version.split(".")[0].replace("v", ""), 10);
if (majorNodeVersion >= 14) {
    console.log(majorNodeVersion);
    connectDB()
        .then(() => {
            app.listen(3232 || process.env.PORT, () => {
                console.info("⚙️  Server is running on port: " + process.env.PORT);
            });
        })
        .catch((err) => {
            console.log("MongoDB connection error:", err);
        });
} else {
    console.info("🚧 Please install a newer Node.js version.");
}

//SAMPLE ROUTE
app.get("/", (req, res) => {
    res.send("The Dike server is running");
})


// Common error handling middleware
// app.use(errorHandler);
