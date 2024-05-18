import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import Notes from "./components/notes/notes";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "./App.css";

const App = () => {
  const [notes, setNotes] = useState([
    { id: 1, content: "Hello this is the first note" },
    { id: 2, content: "Hello this is the second note" },
  ]);
  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (newNote === "") {
      alert("Please Enter a Valid Note");
      return;
    }
    setNotes([...notes, { id: notes.length + 1, content: newNote }]);
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  return (
    <div>
      <div className="add-note">
        <input
          type="text"
          placeholder="Add new Note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <div className="add-note-icon" onClick={addNote}>
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
      <Notes notes={notes} setNotes={setNotes} />
    </div>
  );
};

export default App;
