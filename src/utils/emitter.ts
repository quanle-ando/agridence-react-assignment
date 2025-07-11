import Emittery from "emittery";

type EmitteryEventConfigType = {
  FETCH_ALL_NOTES: undefined;
  CREATE_NEW_NOTE: undefined;
  VIEW_NOTE: string;
  LOG_OUT: undefined;
  UPDATE_HEADER: string;
};

export const emitter = new Emittery<EmitteryEventConfigType>();
