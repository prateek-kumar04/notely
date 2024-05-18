import { forwardRef, useEffect } from "react";

import "./Note.scss";

const Note = forwardRef(function Note(props, noteRef) {
  const { description, notePosition } = props;

  useEffect(() => {
    if (noteRef.current) {
      noteRef.current.style.setProperty("left", `${notePosition?.x}px`);
      noteRef.current.style.setProperty("top", `${notePosition?.y}px`);
    }
  }, [noteRef.current]);

  return (
    <div className="note" ref={noteRef} {...props}>
      📌 {description}
    </div>
  );
});

export default Note;
