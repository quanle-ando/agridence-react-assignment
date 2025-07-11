import { Modal, notification } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { NoteInfoType } from "../../../shared/CommonTypes.interface";
import { twJoin } from "tailwind-merge";
import FormInput from "../../../components/FormInput/FormInput";
import FormTextArea from "../../../components/FormInput/FormTextArea";
import { emitter } from "../../../utils/emitter";
import PersonalNotesModuleCss from "../_PersonalNotes.module.css";
import { navigateRef } from "../../../containers/CommonInit/CommonInit";

function CreateNoteModalComponent({
  isVisible,
  onClose,
  afterClose,
}: {
  isVisible: boolean;
  onClose(): void;
  afterClose(): void;
}) {
  const [newNote, setNewNote] = useState<
    Pick<NoteInfoType, "description" | "title">
  >({ description: "", title: "" });

  const [isCreating, setIsCreating] = useState(false);

  return (
    <Modal
      open={isVisible}
      title="Create New Note"
      closable={!isCreating}
      onCancel={onClose}
      okText="Create Note"
      onOk={() => {
        setIsCreating(true);
        axios("/api/create-new-note", {
          method: "POST",
          data: {
            title: newNote?.title,
            description: newNote?.description,
          },
        })
          .then((res) => {
            emitter.emit("FETCH_ALL_NOTES");
            notification.success({
              message: `Successfully created note "${
                (res.data as NoteInfoType).title
              }"`,
            });
            onClose();
          })
          .finally(() => {
            setIsCreating(false);
          });
      }}
      okButtonProps={{
        disabled: !newNote.title || !newNote.description,
        loading: isCreating,
      }}
      cancelButtonProps={{ loading: isCreating }}
      afterClose={afterClose}
      destroyOnHidden
      {...(window.__VITEST__ && { transitionName: "", maskTransitionName: "" })}
    >
      <div
        className={twJoin("overflow-auto", "flex", "flex-col", "gap-[24px]")}
      >
        <FormInput
          fieldLabel="Note title"
          placeholder="Please input your note title here"
          value={newNote.title}
          onChange={(e) => {
            setNewNote((cur) => ({ ...cur, title: e.target.value }));
          }}
          maxLength={200}
        />

        <FormTextArea
          fieldLabel="Note description"
          placeholder="Please input your note title here"
          value={newNote.description}
          textareaClassname={PersonalNotesModuleCss["note-description"]}
          onChange={(e) => {
            setNewNote((cur) => ({ ...cur, description: e.target.value }));
          }}
          maxLength={1000}
        />
      </div>
    </Modal>
  );
}

export default function CreateNoteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInternallVisible, setIsInternalVisible] = useState(false);

  useEffect(() => {
    setIsInternalVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    return emitter.on("CREATE_NEW_NOTE", () => {
      setIsOpen(true);
    });
  }, []);

  return !isOpen ? null : (
    <CreateNoteModalComponent
      isVisible={isInternallVisible}
      onClose={() => {
        setIsInternalVisible(false);
      }}
      afterClose={() => {
        setIsOpen(false);
        navigateRef.current("auth/personal-notes", { replace: true });
      }}
    />
  );
}
