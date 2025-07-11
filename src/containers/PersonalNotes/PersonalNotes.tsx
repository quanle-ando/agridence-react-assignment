import axios from "axios";
import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NoteInfoType } from "../../shared/CommonTypes.interface";
import { Button, Card, Modal, notification, Skeleton } from "antd";
import { twJoin } from "tailwind-merge";
import { navigateRef } from "../../containers/CommonInit/CommonInit";
import keyBy from "lodash-es/keyBy";
import NoteModal from "./NoteModal/NoteModal";
import CreateNoteModal from "./CreateNoteModal/CreateNoteModal";
import { emitter } from "../../utils/emitter";
import truncate from "lodash-es/truncate";
import { Outlet } from "react-router";
import { FileAddOutlined } from "@ant-design/icons";

export default function PersonalNotes() {
  const [notes, setNotes] = useState<NoteInfoType[]>();
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  const notesMap = useMemo(
    () => new Map(Object.entries(keyBy(notes, (note) => note.id))),
    [notes]
  );

  const [noteId, setNoteId] = useState<string>();

  const noteInView = notesMap.get(String(noteId));

  const hasLoadedNotes = typeof notes !== "undefined";

  const isInvalidNoteIdInPathParams = hasLoadedNotes && noteId && !noteInView;

  useLayoutEffect(() => {
    return emitter.on("VIEW_NOTE", (id) => {
      setNoteId(id);
    });
  }, []);

  useLayoutEffect(() => {
    return emitter.on("FETCH_ALL_NOTES", () => {
      fetchNotesRef.current();
    });
  }, []);

  useEffect(() => {
    if (isInvalidNoteIdInPathParams) {
      // Invalid note ID
      navigateRef.current("/auth/personal-notes", { replace: true });
    }
  }, [isInvalidNoteIdInPathParams]);

  function fetchNotes() {
    setIsLoadingNotes(true);
    axios("/api/get-all-personal-notes")
      .then((res) => {
        setNotes((res.data as { notes: NoteInfoType[] }).notes);
      })
      .finally(() => {
        setIsLoadingNotes(false);
      });
  }

  const fetchNotesRef = useRef(fetchNotes);
  fetchNotesRef.current = fetchNotes;

  useEffect(() => {
    emitter.emit("FETCH_ALL_NOTES");
  }, []);

  useEffect(() => {
    emitter.emit("UPDATE_HEADER", "Personal Notes");
  }, []);

  return (
    <>
      {(() => {
        if (isLoadingNotes) {
          return <Skeleton active data-is-loading-notes />;
        }

        return (
          <div>
            <Card
              title={
                <div className={twJoin("flex", "flex-row", "justify-between")}>
                  <div>Displaying {notes?.length} note(s)</div>
                  <Button
                    icon={<FileAddOutlined />}
                    color="blue"
                    variant="solid"
                    onClick={() => {
                      navigateRef.current("auth/personal-notes/create");
                    }}
                  >
                    Create New Note
                  </Button>
                </div>
              }
            >
              <div className={twJoin("grid", "grid-cols-3", "gap-[16px]")}>
                <div>
                  <b>Note Title</b>
                </div>
                <div>
                  <b>Note Description</b>
                </div>
                <div>
                  <b>View</b>
                </div>

                {notes?.map((note) => (
                  <Fragment key={note.id}>
                    <div data-is-note-title>
                      {truncate(note.title, { length: 100 })}
                    </div>
                    <div>{truncate(note.description, { length: 150 })}</div>
                    <div className={twJoin("flex", "flex-row", "gap-[8px]")}>
                      <Button
                        color="cyan"
                        variant="solid"
                        onClick={() => {
                          navigateRef.current(
                            `/auth/personal-notes/${note.id}`
                          );
                        }}
                        data-note-id={note.id}
                        data-note-title={truncate(note.title, { length: 10 })}
                      >
                        View
                      </Button>

                      <Button
                        color="danger"
                        variant="solid"
                        onClick={() => {
                          Modal.confirm({
                            content: `Do you want to delete the note "${note.title}"?`,
                            async onOk() {
                              return axios(
                                `/api/delete-note-by-id/${note.id}`,
                                {
                                  method: "delete",
                                }
                              ).then(() => {
                                emitter.emit("FETCH_ALL_NOTES");
                                notification.success({
                                  message: `Successfully deleted "${note.title}"!`,
                                });
                              });
                            },
                          });
                        }}
                        data-note-id={note.id}
                        data-note-title={truncate(note.title, { length: 10 })}
                      >
                        Delete
                      </Button>
                    </div>
                  </Fragment>
                ))}
              </div>
            </Card>
          </div>
        );
      })()}

      <CreateNoteModal />

      <NoteModal
        isVisible={Boolean(noteInView)}
        onClose={() => {
          setNoteId(undefined);
          navigateRef.current("/auth/personal-notes");
        }}
        note={noteInView}
      />

      <Outlet />
    </>
  );
}
