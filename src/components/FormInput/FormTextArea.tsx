import { Input } from "antd";
import { ReactNode, useMemo } from "react";
import { nanoid } from "nanoid";
import { TextAreaProps } from "antd/es/input";
import { twMerge } from "tailwind-merge";

export default function FormTextArea({
  className,
  id,
  fieldLabel,
  textareaClassname,
  ...props
}: TextAreaProps & { fieldLabel: ReactNode; textareaClassname?: string }) {
  const inputId = useMemo(() => id || nanoid(), [id]);

  return (
    <div className={className}>
      <label htmlFor={inputId}>{fieldLabel}</label>
      <Input.TextArea
        title={typeof fieldLabel === "string" ? fieldLabel : undefined}
        id={inputId}
        className={twMerge("max-h-[200px]", "h-[100px]", textareaClassname)}
        {...props}
      />
    </div>
  );
}
