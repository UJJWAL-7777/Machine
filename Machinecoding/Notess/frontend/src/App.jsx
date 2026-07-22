import {
    useEffect,
    useState
} from "react";

import api from "./api";

import NoteForm
from "./components/NoteForm";

import NoteList
from "./components/NoteList";

function App() {

    const [notes, setNotes] =
    useState([]);

    const [search, setSearch] =
    useState("");

    const [
        editingNote,
        setEditingNote
    ] = useState(null);

    const [loading, setLoading] =
    useState(true);

    const [error, setError] =
    useState("");



    const fetchNotes = async () => {

        try {

            setLoading(true);

            const response =
            await api.get("/notes");

            setNotes(response.data);

            setError("");

        } catch (err) {

            setError(
                "Unable to load notes"
            );

        } finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        fetchNotes();

    }, []);



    const addNote =
    async (noteData) => {

        try {

            const response =
            await api.post(
                "/notes",
                noteData
            );

            setNotes([
                response.data,
                ...notes
            ]);

            setError("");

        } catch (err) {

            setError(
                "Unable to add note"
            );

        }

    };



    const deleteNote =
    async (id) => {

        try {

            await api.delete(
                `/notes/${id}`
            );

            setNotes(
                notes.filter(
                    (note) =>
                    note._id !== id
                )
            );

        } catch (err) {

            setError(
                "Unable to delete note"
            );

        }

    };



    const updateNote =
    async (id, noteData) => {

        try {

            const response =
            await api.put(
                `/notes/${id}`,
                noteData
            );

            setNotes(

                notes.map(

                    (note) =>

                    note._id === id

                    ? response.data

                    : note

                )

            );

            setEditingNote(null);

        } catch (err) {

            setError(
                "Unable to update note"
            );

        }

    };



    const startEditing =
    (note) => {

        setEditingNote(note);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };



    const cancelEdit = () => {

        setEditingNote(null);

    };



    const filteredNotes =

    notes.filter((note) =>

        note.title
        .toLowerCase()
        .includes(
            search.toLowerCase()
        )

        ||

        note.content
        .toLowerCase()
        .includes(
            search.toLowerCase()
        )

    );



    return (

        <div className="app">

            <h1>
                Notes App
            </h1>


            <NoteForm

                addNote={addNote}

                updateNote={
                    updateNote
                }

                editingNote={
                    editingNote
                }

                cancelEdit={
                    cancelEdit
                }

            />


            <input

                className="search-input"

                type="text"

                placeholder=
                "Search notes"

                value={search}

                onChange={
                    (e) =>
                    setSearch(
                        e.target.value
                    )
                }

            />


            {
                error && (

                    <p className="error">

                        {error}

                    </p>

                )
            }


            {

                loading

                ?

                <h2>
                    Loading...
                </h2>

                :

                <NoteList

                    notes={
                        filteredNotes
                    }

                    deleteNote={
                        deleteNote
                    }

                    startEditing={
                        startEditing
                    }

                />

            }

        </div>

    );
}

export default App;