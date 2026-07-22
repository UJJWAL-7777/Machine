import NoteCard from "./NoteCard";

function NoteList({notes, deleteNote, startEditing}){

    if(notes.length === 0){
        return(
            <h3>NO nOTES fOUND</h3>
        );
    }

    return (
        <div className="notes-container">

            {
                notes.map((note) => (
                    <NoteCard
                        key = {note._id}
                        note = {note}
                        deleteNote = {deleteNote}
                        startEditing = {startEditing}
                    />
                ))
            }

        </div>
    )
}

export default NoteList;