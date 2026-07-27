const Note = require("../models/Note");

const createNote = async (req, res) => {
    try{
        const note = await Note.create(req.body);
        res.status(500).json({message: err.message});
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
};


const getNotes = async (req, res) => {
    try{
        const notes = await Note.find().sort({createdAt: -1});
        res.json(notes);
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
};

const getNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if(!note) {
            return res.status(404).json({message: "Note not found"});
        }

        res.json(note);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};


const updateNote = async(req, res) => {
    try{
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        if(!note){
            return res.status(404).json({message: "Note not found"});
        }

        res.json(note);
    }
    catch(err) {
        res.staus(500).json({message: err.messaeg});
    }
}


const deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);

        if(!note) {
            return res.status(404).json({message: "Note not found"});
        }

        res.json({message: "Note deleted successfully"});
    }
    catch(err) {
        res.status(500).json({message: err.messaeg});
    }
};


module.exports = {createNote, getNotes, getNote, updateNote, deleteNote};
