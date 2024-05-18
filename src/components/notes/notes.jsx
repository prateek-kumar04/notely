import { createRef, useEffect, useRef } from "react";

import Note from "../note/Note";

const Notes = (props) => {
  const { notes = [], setNotes = () => {} } = props;

  const notesRef = useRef([]);

  const randomPosition = () => {
    const maxX = window.innerWidth - 100;
    const maxY = window.innerWidth - 100;

    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
    };
  };

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

    const updatedNotes = notes.map((note) => {
      const savedNote = savedNotes.find((ele) => ele.id === note.id);
      if (savedNote) {
        return { ...note, notePosition: savedNote.notePosition };
      } else {
        const notePosition = randomPosition();
        return { ...note, notePosition };
      }
    });

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  }, [notes.length]);

  const updateNotesPosition = (id, newPos) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, notePosition: newPos } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const handleDragStart = (note, event) => {
    const { id } = note;
    const noteRef = notesRef.current[id].current;

    const rect = noteRef.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const startPosition = note.notePosition;

    const handleMouseMove = (event) => {
      const newX = event.clientX - offsetX;
      const newY = event.clientY - offsetY;

      noteRef.style.left = `${newX}px`;
      noteRef.style.top = `${newY}px`;
    };

    const overlapCheck = (id) => {
      const currNoteRef = notesRef.current[id].current;
      const selfNoteRect = currNoteRef.getBoundingClientRect();

      return notes.some((note) => {
        if (note.id === id) return false;
        const otherNote = notesRef.current[note.id].current;
        const otherNoteRect = otherNote.getBoundingClientRect();

        const overlap = !(
          selfNoteRect.right < otherNoteRect.left ||
          selfNoteRect.left > otherNoteRect.right ||
          selfNoteRect.bottom < otherNoteRect.top ||
          selfNoteRect.top > otherNoteRect.bottom
        );
        return overlap;
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      const finalRect = noteRef.getBoundingClientRect();
      const finalPosition = { x: finalRect.left, y: finalRect.top };

      if (overlapCheck(id)) {
        noteRef.style.left = `${startPosition.x}px`;
        noteRef.style.top = `${startPosition.y}px`;
      } else {
        updateNotesPosition(id, finalPosition);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div>
      {notes.map((note) => {
        return (
          <Note
            key={note.id}
            description={note.content}
            notePosition={note.notePosition}
            ref={
              notesRef.current[note.id]
                ? notesRef.current[note.id]
                : (notesRef.current[note.id] = createRef())
            }
            onMouseDown={(event) => handleDragStart(note, event)}
          />
        );
      })}
    </div>
  );
};

export default Notes;
