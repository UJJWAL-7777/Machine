const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    shortUrl: {
        type: String
    },
    clicks: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type:Date,
        default: null
    }

},  {timestamp: true});


const Url = mongoose.model("Url", urlSchema);

module.exports = Url;



// shortCode: Unique identifier used to find the original URL.



// shortUrl: Link shared with other people.



// clicks: Counts how many times the short link is visited.



// expiresAt: Optional expiration date.



// timestamps: Automatically creates createdAt and updatedAt.
