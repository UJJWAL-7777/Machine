const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes")
const noteRoutes = require("./routes/noteRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,         //15 min........maximum request is 100
    max: 50,
    message: {
        message: "Too many requests, please try again later"
    }
});

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Notes API is running................"
    });
});

app.use(errorHandler);    //using the global error handler part ------

module.exports = app;