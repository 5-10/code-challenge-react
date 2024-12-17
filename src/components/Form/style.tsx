import React from "react";
import { classNames } from "@/utils";
import withForwardRef, { ForwardRefProps } from "@/hoc/withForwardRef";

type StyledFormProps = React.HTMLAttributes<HTMLFormElement> & ForwardRefProps<HTMLFormElement>;
export const StyledForm = withForwardRef(({ forwardedRef, ...props }: StyledFormProps) => {
  return <form onSubmit={(event) => event.preventDefault()} className="w-full" ref={forwardedRef} {...props} />;
});

interface FooterProps {
  alignRight?: boolean;
  spaceBetween?: boolean;
}
export function Footer(props: React.PropsWithChildren<FooterProps>) {
  const className = classNames(
    props.alignRight && "text-right items-end",
    props.spaceBetween && "justify-between",
    "flex flex-1 flex-row pt-8 [&>*:first-child]:mr-4",
  );

  return <div className={className}>{props.children}</div>;
}

export function FieldSet(props: React.PropsWithChildren) {
  const className = classNames("grid gap-y-4");

  return (
    <div role="form-fieldset" className={className}>
      {props.children}
    </div>
  );
}
