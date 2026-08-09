const express = require("express");
const router = express.Router();

const {createNote, getNotes, getNoteById, updateNote, deleteNode, searchNotes, togglePinNote, toggleArchiveNote, getNotesByTag} = require("../controllers/noteController");
const {protect} = require("../middleware/authMiddleware");



router.post("/", protect, createNote);
router.get("/", protect, getNotes);
router.get("/search", protect, searchNotes);          //search should be at the top of the getNoteById
router.get("/tag/:tag", protect, getNotesByTag);

router.get("/:id", protect, getNoteById);
router.put("/:id", protect, updateNote);

router.patch("/:id/pin", protect, togglePinNote);
router.patch("/:id/archive", protect, toggleArchiveNote);
router.delete("/:id", protect, deleteNode);


module.exports = router;