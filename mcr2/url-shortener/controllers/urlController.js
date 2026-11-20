const Url = require("../models/Url");
const {nanoid} = require("nanoid");

const createShortUrl = async (req, res) => {
    try{
        const {originalUrl, customCode, expiresAt} = req.body;

        if(!originalUrl) {
            return res.status(400).json({
                message: "URL is required"
            });
        }

        const shortCode = customCode || nanoid(6);

        const existingUrl = await Url.findOne({ shortCode });

        if(existingUrl){
            return res.status(400).json({
                message: "Custom code already exists. Please choose a different one."
            });
        }

        let expirationDate = null;
        if (expiresAt) {
            expirationDate = new Date(expiresAt);
            if (isNaN(expirationDate.getTime())) {
                return res.status(400).json({
                    message: "Invalid expiration date format. Please use a valid date."
                });
            }   
        }



        const shortUrl = `http://localhost:5000/${shortCode}`;

        const newUrl = await Url.create({
            originalUrl,
            shortCode,
            shortUrl,
            expiresAt: expirationDate
        });

        res.status(201).json({
            message: "Short URL created successfully",
            data: newUrl
        });
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }


};

const redirectUrl = async(req, res) => {
    try{
        const { shortCode } = req.params;

        const url = await Url.findOne({ shortCode });

        if(!url) {
            return res.status(404).json({
                message: "Short URL has expired"
            });
        } 

        if (url.expiresAt && url.expiresAt < new Date()) {
            return res.status(410).json({
                message: "Short URL has expired"
            });
        }

        url.clicks += 1;
        await url.save();


        res.redirect(url.originalUrl);

    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getUrlStats = async (req, res) => {
    try{
        const { shortCode } = req.params;

        const url = await Url.findOne({ shortCode });

        if(!url) {
            return res.status(404).json({
                message: "Short URL not found"
            });
        }

        res.status(200).json({
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: url.shortUrl,
            clicks: url.clicks,
            createdAt: url.createdAt,
            expiresAt: url.expiresAt
        });
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const deleteShortUrl = async (req, res) => {
    try{
        const {shortCode} = req.params;

        const url = await Url.findOneAndDelete({shortCode});
        if(!url) {
            return res.status(404).json({
                message: "Short URL not found"
            });
        }
        res.status(200).json({
            message: "Short URL deleted successfully"
        });
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
}




module.exports = { createShortUrl, redirectUrl, getUrlStats, deleteShortUrl };





// Important: Since nanoid is ESM-only in current versions, require("nanoid") may fail in a CommonJS 
// project. If it does, tell me; we'll configure the project for ESM or use a CommonJS-compatible 
// alternative.