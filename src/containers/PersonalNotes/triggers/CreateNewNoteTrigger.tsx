import { useEffect } from "react";
import { emitter } from "../../../utils/emitter";

export default function CreateNewNoteTrigger() {
  useEffect(() => {
    emitter.emit("CREATE_NEW_NOTE");
  }, []);

  return null;
}
