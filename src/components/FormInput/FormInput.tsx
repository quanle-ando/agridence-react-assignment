import { Input, InputProps } from "antd";
import { ReactNode, useMemo } from "react";
import { nanoid } from "nanoid";

export default function FormInput({
  className,
  id,
  fieldLabel,
  ...props
}: InputProps & { fieldLabel: ReactNode }) {
  const inputId = useMemo(() => id || nanoid(), [id]);

  return (
    <div className={className}>
      <label htmlFor={inputId}>{fieldLabel}</label>
      <Input
        title={typeof fieldLabel === "string" ? fieldLabel : undefined}
        id={inputId}
        {...props}
      />
    </div>
  );
}
