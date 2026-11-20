const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");
const { redirectUrl } = require("./controllers/urlController");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/url", urlRoutes);
app.get("/:shortCode", redirectUrl);

connectDB();

app.get("/", (req, res) => {
    res.send("URL Shortener API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});