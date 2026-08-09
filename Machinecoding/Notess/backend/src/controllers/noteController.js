const Note = require("../models/Note");

//CREATE NOTES ------------------------------------
const createNote = async(req, res, next) => {
    try{
        const{title, content, tags} = req.body;

        // if(!title || !content){                              //done this part in validator folder part 
        //     return res.status(400).json({
        //         message: "Title and content are required"
        //     });
        // }

        const note = await Note.create({
            title,
            content,
            tags,
            user: req.user._id
        });

        res.status(201).json(note);
    }
    catch(error) {
        // res.status(500).json({
        //     message: error.message
        // });
        next(error);
    }
};


//GET NOTES----------------------------------------
// const getNotes = async(req, res) => {
//     try{
//         const notes = await Note.find({
//             user: req.user._id
//         }).sort({
//             createdAt: -1
//         });

//         res.status(200).json(notes);
//     }
//     catch(error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// };

// ---------------------------------------------------------
const getNotes = async(req, res) => {      //PAGINATION IS USED HERE - ------------------------------------
    try{

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const totalNotes = await Note.countDocuments({
            user: req.user._id,
            isArchived: false
        });

        const notes = await Note.find({
            user: req.user._id,
            isArchived: false
        })
        .sort({
            createdAt: - 1
        })
        .skip(skip)
        .limit(limit);

        res.status(200).json({
            totalNotes,
            currentPage: page,
            totalPages: Math.ceil(totalNotes/limit),
            notes
        });
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
}



//get notes by id ------------------------------------------
const getNoteById = async(req, res) => {
    try{

        const note = await Note.findById(req.params.id);   //

        if(!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        if(note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json()({
                message: "Access denied"
            });
        }

        res.status(200).json(note);
    }

    catch(error) {
        res.status(500).json({
            message: error.message
        });
        
    }
}


//UPDATE NOTE USNG PUT METHOD --------------------------------------
const updateNote = async(req, res) => {
    try{
        const note = await Note.findById(req.params.id);

        if(!note){
            return res.status(404).json({
                message: "Note not found"
            });
        }

        if(note.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message: "Access denied"
            });
        }

        note.title = req.body.title || note.title;              // it helps in the parital updates..if the ield isn't provided, it's existing value is preserved-----
        note.content = req.body.content || note.content;
        note.tags = req.body.tags || note.tags;   

        note.isPinned !== undefined
            ? req.body.isPinned
            : note.isPinned;

        const updatedNote = await note.save();
        
        res.status(200).json(updatedNote)
    }

    catch(error) {
        res.status(500).json({
            message: err.message
        })
    }
}



//DELETE NOTE ---------------------------------------------------
const deleteNode = async (req, res) => {
    try{
        const note = await Note.findById(req.params.id);

        if(!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        if(note.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message:"Access denied"
            });
        }

        await note.deleteOne();

        res.status(200).json({
            message: "Note deleted successfully"
        });
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }

}



//search notes ----------------------------------------------------
const searchNotes = async( req, res) => {
    try{
        const {query} = req.query;
        
        if(!query) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const notes = await Note.find({
            user: req.user._id,
            $or : [                         //$or MEANS MATCHES if any condition is true
                {
                    title: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    content: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    content: {
                        $regex: query,
                        $options: "i"
                    }
                }
            ]
        }).sort({
            createdAt: -1
        });

        res.status(200).json(notes);
    }

    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};



//toggle PinNotes ----------------------------------------------------
const togglePinNote = async (req, res) => {
        try{
            const note = await Note.findById(req.params.id);
        
            if(!note) {
                return res.status(404).json({
                    message: "Note not found"
                });
            }
        
            if(note.user.toString() !== req.user._id.toString()){
                return res.status(403).json({
                    message: "Access Denied"
                });
            }
        
            note.isPinned = !note.isPinned;
        
            await note.save();
        
            res.status(200).json({
                message: note.isPinned
                ? "Note pinned successfully"
                : "Note unpinned successfully",
                note
            });
        }
        catch(error) {
            res.status(500).json({
                message: error.messsage
            });
        }
}



//isArchived --------------------------------------------------
const toggleArchiveNote = async( req, res) => {
    try{

        const note = await Note.findById(req.params.id);

        if(!note) {
            return res.status(404).json({
                message: "Access Denied"
            });
        }

        note.isArchived = !note.isArchived;

        await note.save();

        res.status(200).json({
            message: note.isArchived
                ? "Note archived successfully"
                : "Note restored Successfully",

            note
        });
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}




//get notesByTag -------------------------------------------------------------
const getNotesByTag = async(req, res) =>{
    try{
        const {tag} = req.params;

        const notes = await Note.find({
            user: req.user._id,
            isArchived: false,
            tags: tag
        }).sort({
            createdAt: -1
        });

        res.status(200).json(notes);
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}


module.exports = {createNote, getNotes, getNoteById, updateNote, deleteNode, searchNotes, togglePinNote, toggleArchiveNote, getNotesByTag};