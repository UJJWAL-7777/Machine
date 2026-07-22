import React, { useEffect, useState } from 'react'

const NoteForm = (addNote, updateNote, editingNote, cancelEdit) => {

    const[title, setTitle] = useState("");
    const[content, setCount] = useState("");

    useEffect(() => {
        if(editingNote) {
            setTitle(editingNote.title);
            setContent(editingNote.content);
        }
        else{
            setTitle("");
            setCount("");
        }
    },[editingNote]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!title.trim() || !content.trim()){
            return;
        }

        if(editingNote) {
            updateNote(
                editingNote._id,
                noteData
            );
        }
        else{
            addNote(noteData);
        }

        setTitle("");
        setContent("");
    };
    

    return (
        // <div>
            
        // </div>
        <form>
            <h2>
                {
                    editingNote ? "Edit Note" : "Create Note"
                }
            </h2>

            <input type='text' placeholder='Enter title' value={title} onChange={(e) => setTitle(e.target.value)}/>

            <textarea/>

            <button>
                    {editingNote ? "Update Note" : "Add Note"}
                    
                    {
                        editingNote && (
                            <button>Cancel</button>
                        )
                    }
            </button>

            {
                editingNote && (
                    <button type='button' className='cancel-button' onClick={cancelEdit}>
                        Cancel
                    </button>
                )
            }


        </form>
    );
}

export default NoteForm;
