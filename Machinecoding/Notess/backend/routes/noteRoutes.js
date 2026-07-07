const express = require("express");
const router = express.Router();

const {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote
} = require("../controllers/noteController");

const validateNote = require("../middleware/validateNote");

router.post("/", validateNote, createNote);

router.get("/", getNotes);

router.get("/:id", validateNote, updateNote);

router.put("/:id", validateNote, updateNote);

router.delete("/:id", deleteNote);

module.exports = router;