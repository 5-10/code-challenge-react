import React from "react";
import Button, { ButtonProps } from "@/components/Button";
import useFormContext from "@/components/Form/hooks/use-form-context";
import { throttle } from "lodash";
import usePrevious from "@/hooks/usePrevious";

export type SubmitButtonProps = Omit<ButtonProps, "onClick"> & { onSuccess?(): void };

function SubmitButton(props: SubmitButtonProps) {
  const { onClick, isSubmitting } = useOnSubmitButton(props);

  return (
    <Button
      {...props}
      isLoading={isSubmitting || props.isLoading}
      disabled={props.disabled || isSubmitting}
      onClick={onClick}
      type="submit"
    />
  );
}

export default SubmitButton;

function useOnSubmitButton(props: SubmitButtonProps) {
  const { isSubmitting, handleSubmit } = useFormContext();

  const previousIsSubmitting = usePrevious(isSubmitting);

  const submitEventRef = React.useRef<React.FormEvent<HTMLFormElement>>();

  React.useEffect(() => {
    if (previousIsSubmitting && isSubmitting === false) {
      props.onSuccess && props.onSuccess();
    }
  }, [isSubmitting, previousIsSubmitting]);

  async function onClickHandler(event: React.FormEvent<HTMLFormElement>) {
    submitEventRef.current = event;
    handleSubmit(event);
  }

  const onClick = React.useCallback(throttle(onClickHandler, 2000), []);

  return { onClick, isSubmitting };
}
