import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { NoteInfoType } from "../../../shared/CommonTypes.interface";
import { twJoin } from "tailwind-merge";
import PersonalNotesModuleCss from "../_PersonalNotes.module.css";
import FormTextArea from "../../../components/FormInput/FormTextArea";
import FormInput from "../../../components/FormInput/FormInput";

function NoteModalComponent({
  isVisible,
  onClose,
  note,
  afterClose,
}: {
  isVisible: boolean;
  onClose(): void;
  note: NoteInfoType | undefined;
  afterClose(): void;
}) {
  return (
    <Modal
      open={isVisible}
      title="Personal Note Detail"
      onCancel={onClose}
      afterClose={afterClose}
      footer={
        <div>
          <Button onClick={onClose}>Close</Button>
        </div>
      }
      destroyOnHidden
      {...(window.__VITEST__ && { transitionName: "", maskTransitionName: "" })}
    >
      <div className={twJoin("flex", "flex-col", "gap-[16px]")}>
        <div>
          <FormInput fieldLabel="Note title" value={note?.title} readOnly />
        </div>
        <div>
          <FormTextArea
            fieldLabel="Note description"
            value={note?.description}
            textareaClassname={PersonalNotesModuleCss["note-description"]}
            readOnly
          />
        </div>
      </div>
    </Modal>
  );
}

export default function NoteModal({
  isVisible,
  onClose,
  note,
}: {
  isVisible: boolean;
  onClose(): void;
  note: NoteInfoType | undefined;
}) {
  const [isInternallVisible, setIsInternalVisible] = useState(false);

  useEffect(() => {
    setIsInternalVisible(isVisible);
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <NoteModalComponent
      isVisible={isInternallVisible}
      note={note}
      onClose={() => {
        setIsInternalVisible(false);
      }}
      afterClose={() => {
        onClose();
      }}
    />
  );
}
