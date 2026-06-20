const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Mongodb Connected"))
.catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Server running")
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});



