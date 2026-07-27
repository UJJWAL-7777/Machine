const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim:true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        tags: [
            {
                type: String,
                trim: true
            }
        ],

        isPinned: {
            type: Boolean,
            default: false
        },

        isArchived: {
            type: Boolean,
            default: false
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    },

    {
        timestamps: true
    }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;