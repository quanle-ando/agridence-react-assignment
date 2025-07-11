import { useEffect } from "react";
import { emitter } from "../../../utils/emitter";
import { useParams } from "react-router";

export default function ViewNoteTrigger() {
  const { noteId } = useParams();

  useEffect(() => {
    emitter.emit("VIEW_NOTE", String(noteId));
  }, [noteId]);

  return null;
}
