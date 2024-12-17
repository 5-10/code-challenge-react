import React, { InputHTMLAttributes } from "react";
import { classNames } from "@/utils";
import { InjectedFormElementProps } from "@/components/Form/hoc/withForm";

export function Container(props: React.PropsWithChildren<{ hidden?: boolean }>) {
  return (
    <div role="input-component-container" className="w-full">
      {props.children}
    </div>
  );
}

interface InputContainerProps {
  invalid?: boolean;
  autoFocus?: boolean;
  isFocused?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  STORYBOOK_mockHoverState?: boolean;
  STORYBOOK_mockFocusState?: boolean;
}

export function InputContainer(props: React.PropsWithChildren<InputContainerProps>) {
  const isFocused = Boolean(props.isFocused) || Boolean(props.STORYBOOK_mockFocusState);
  const invalid = Boolean(props.invalid);

  const className = classNames(
    "flex flex-row items-center gap-2 self-stretch py-3 px-4 rounded-3",
    isFocused ? "bg-white border-textureIris border-2" : "bg-textureNeutralGray border-1",
    invalid === false && isFocused === false && "border-textureMediumLavender hover:border-texturePlaceholder",
    invalid && isFocused === false && "border-textureInvalid hover:border-textureInvalid",
    props.disabled && "border-texturePlaceholder opacity-40 cursor-not-allowed",
    props.STORYBOOK_mockHoverState && "border-texturePlaceholder",
  );

  return (
    <div onClick={props.onClick} className={className}>
      {props.children}
    </div>
  );
}

type StyledInputProps = {
  ref?: React.Ref<HTMLInputElement>;
  invalid?: boolean;
  isFocused?: boolean;
  withForm?: boolean;
  STORYBOOK_mockFocusState?: boolean;
} & InputHTMLAttributes<HTMLInputElement> &
  Partial<InjectedFormElementProps>;

export const StyledInput = React.forwardRef<HTMLInputElement, React.PropsWithChildren<StyledInputProps>>(
  (props, ref) => {
    const { wasSubmitted, errorMessage, invalid, withForm, isFocused, STORYBOOK_mockFocusState, ...inputProps } = props;

    const isInputFocused = isFocused || Boolean(STORYBOOK_mockFocusState);

    const className = classNames(
      "font-inter text-base leading-24 tracking-0.04",
      "w-full p-0 border-0 focus:ring-0",
      isInputFocused ? "bg-white p-0" : "p-px bg-textureNeutralGray",
      inputProps.disabled ? "cursor-not-allowed" : "cursor - pointer",
      invalid === false && "placeholder-texturePlaceholder",
      invalid && isInputFocused === false && "placeholder-textureInvalid",
    );

    const styledInputProps: InputHTMLAttributes<HTMLInputElement> = {
      type: "text",
      ...inputProps,
      ...(withForm && { value: props.value ?? "" }),
    };

    return <input className={className} {...styledInputProps} ref={ref} />;
  },
);

export function Icon(props: React.PropsWithChildren<{ right?: boolean }>) {
  const className = classNames("flex items-center", props.right ? "right-0" : "left-0");

  return <div className={className}>{props.children}</div>;
}

export function StyledLabel(
  props: React.PropsWithChildren<{
    invalid?: boolean;
    required?: boolean;
  }>,
) {
  const className = classNames(
    "flex flex-row items-start text-textureDarkIndigo font-epilogue text-sm font-normal leading-16 tracking-0.035 mb-2",
    props.invalid && "text-red-900",
    props.required && "after:content-*",
  );

  return <label className={className}>{props.children}</label>;
}

export function WordCount(props: React.PropsWithChildren) {
  return <span className="font-inter text-xs leading-16 text-textureInputCount">{props.children}</span>;
}
export function Description(props: React.PropsWithChildren) {
  const className = classNames(
    "font-inter text-xs leading-16 text-textureInputCount ",
    "flex items-start gap-4 self-stretch py-1 px-0",
  );
  return <div className={className}>{props.children}</div>;
}
