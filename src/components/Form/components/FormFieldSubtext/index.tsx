import React from "react";

import { FormFieldProps } from "@/components/Form/hoc/withForm";
import { classNames } from "@/utils";

export interface FormFieldSubtextProps extends FormFieldProps {
  isError?: boolean;
}

export default function FormFieldSubtext(props: React.PropsWithChildren<FormFieldSubtextProps>) {
  const className = classNames("mb-2 mt-2 text-xs font-normal", props.isError ? "text-textureRed" : "text-textureBlue");
  return (
    <p className={className} id={props.name}>
      {props.children}
    </p>
  );
}
