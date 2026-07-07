const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO.URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


const PORT = process.env.PORT || 7000;

app.listen(() => {
    console.log(`Server running on PORT ${PORT}`);
});
