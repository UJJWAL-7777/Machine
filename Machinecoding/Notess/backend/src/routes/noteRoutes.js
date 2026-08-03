const express = require("express");
const router = express.Router();

const {createNote, getNotes, getNoteById, updateNote, deleteNode} = require("../controllers/noteController");
const {protect} = require("../middleware/authMiddleware");


router.post("/", protect, createNote);
router.get("/", protect, getNotes);
router.get("/:id", protect, getNoteById);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNode);


module.exports = router;