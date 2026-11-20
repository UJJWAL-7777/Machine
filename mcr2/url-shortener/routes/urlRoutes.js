const express = require("express");
const router = express.Router();

const{ createShortUrl, redirectUrl, getUrlStats, deleteShortUrl } = require("../controllers/urlController");

router.post("/shorten", createShortUrl);
router.get("/stats/:shortCode", getUrlStats);
router.delete("/:shortCode", deleteShortUrl);
router.post("/:shortCode", redirectUrl);


module.exports = router;