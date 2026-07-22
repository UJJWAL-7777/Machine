import React from 'react'

const NoteCard = (note, deleteNote, startEditing) => {
    return (
        <div>
            <h3>{note.title} </h3>

            <p>{note.content} </p>

            <div className='note-buttons'>
                <button className='edit-button' onClick={() => startEditing(note)}>
                    Edit
                </button>

                <button className='delete-button' onClick={() => deleteNote(note._id)}>
                    Delete
                </button>
            </div>

        </div>
    )
}

export default NoteCard
