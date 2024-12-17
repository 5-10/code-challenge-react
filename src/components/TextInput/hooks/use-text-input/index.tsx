import React, { HTMLInputTypeAttribute } from "react";
import usePrevious from "@/hooks/usePrevious";
import { Icon } from "@/components/TextInput/style";
import { isFunction, isUndefined, merge, omit } from "lodash";
import { ForwardRefProps } from "@/hoc/withForwardRef";
import { RequireOnlyOne } from "@9yco/utils.utils/types";

export interface TextInputProps extends StyleProps, ForwardRefProps<HTMLInputElement> {
  id?: string;
  placeholder?: string;
  description?: string;
  type?: HTMLInputTypeAttribute;
  label?: string;
  className?: string;
  onChange?(event: React.SyntheticEvent<HTMLInputElement>): void;
  iconLeft?: React.ReactNode | IconFunction;
  iconRight?: React.ReactNode | IconFunction;
  value?: string;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  onClick?(event: React.MouseEvent<HTMLInputElement>): void;
  tooltip?: string | React.ReactNode;
  onBlur?(event: React.FocusEvent<HTMLInputElement>): void;
  onFocus?(event: React.FocusEvent<HTMLInputElement>): void;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  hidden?: boolean;
  autoFocus?: boolean;
  STORYBOOK_mockHoverState?: boolean;
  STORYBOOK_mockFocusState?: boolean;
}

type SizeProps = RequireOnlyOne<{ large: boolean; medium: boolean; small: boolean }>;
export interface StyleProps {}

type IconFunction = (value?: string) => React.ReactElement;
export default function useTextInput(props: TextInputProps) {
  const { isFocused, onFocus, onBlur } = useInputFocus(props);

  const [wordCount, setWordCount] = React.useState(props.value?.length ?? 0);

  const previousValue = usePrevious(props.value);

  const ref = React.useRef<HTMLInputElement | null>(null);

  const inputRef = (props.forwardedRef || ref) as React.RefObject<HTMLInputElement | null>;

  const shouldResetTextInput = previousValue && isUndefined(props.value);

  React.useEffect(() => {
    // Since undefined is not recognized as a prop we have to set it imperatively
    if (shouldResetTextInput && inputRef?.current?.value) {
      // @ts-ignore
      inputRef.current.value = undefined;
    }
  }, [shouldResetTextInput]);

  const LeftIcon = renderLeftIcon() ? <Icon>{renderLeftIcon() || null}</Icon> : null;

  const RightIcon = renderRightIcon() ? <Icon right>{renderRightIcon() || null}</Icon> : null;

  const hasLeftIcon = Boolean(renderLeftIcon());

  const hasRightIcon = Boolean(renderRightIcon());

  const inputProps = merge(omit(props, ["formik"]), {
    id: props.id,
    isFocused,
    onFocus,
    onBlur,
    onChange,
    onClick,
    autoFocus: props.autoFocus,
  });

  function renderRightIcon() {
    return isFunction(props.iconRight) ? props?.iconRight(props?.value ?? inputRef?.current?.value) : props.iconRight;
  }

  function renderLeftIcon() {
    return isFunction(props.iconLeft) ? props?.iconLeft(props?.value ?? inputRef?.current?.value) : props.iconLeft;
  }

  function onClick(event: React.MouseEvent<HTMLInputElement>) {
    event.stopPropagation();
    props.onClick && props.onClick(event);
  }

  function onInputContainerClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    inputRef.current?.focus();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setWordCount(event.target.value.length);
    props.onChange && props.onChange(event);
  }

  return {
    inputProps,
    LeftIcon,
    RightIcon,
    inputRef,
    hasLeftIcon,
    hasRightIcon,
    onInputContainerClick,
    wordCount,
    isFocused,
    tooltip: props.tooltip,
  };
}

function useInputFocus(props: TextInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    props.onFocus && props.onFocus(event);
    setIsFocused(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    props.onBlur && props.onBlur(event);
    setIsFocused(false);
  };

  return {
    isFocused,
    onFocus: handleFocus,
    onBlur: handleBlur,
    setIsFocused,
  };
}
