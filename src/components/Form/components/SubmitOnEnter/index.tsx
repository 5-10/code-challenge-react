import React, { MutableRefObject } from "react";
import useFormContext from "@/components/Form/hooks/use-form-context";

interface SubmitOnEnterProps {
  wrapperRef: MutableRefObject<HTMLElement>;
  submitOnEnter: boolean | string[];
}

export function SubmitOnEnter({ wrapperRef, submitOnEnter }: SubmitOnEnterProps) {
  const { isSubmitting, handleSubmit, validateForm, errors } = useFormContext();

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!submitOnEnter) return;
    if (submitOnEnter === true) {
      wrapper.addEventListener("keydown", handleKeyDown);
      return () => {
        wrapper.removeEventListener("keydown", handleKeyDown);
      };
    }
    submitOnEnter.forEach((name) => {
      const input = wrapper.querySelector(`[name="${name}"]`);
      if (input) {
        input.addEventListener("keydown", handleKeyDown);
      }
    });
    return () => {
      (submitOnEnter as string[]).forEach((name) => {
        const input = wrapper.querySelector(`[name="${name}"]`);
        if (input) {
          input.removeEventListener("keydown", handleKeyDown);
        }
      });
    };
  }, [wrapperRef.current]);

  const [currentField, setCurrentField] = React.useState<HTMLInputElement | null>(null);
  React.useEffect(() => {
    // if the current field is not defined, we don't want to focus on anything
    if (!submitOnEnter || !currentField || (submitOnEnter !== true && !submitOnEnter.includes(currentField.name)))
      return;
    if (errors[currentField.name]) {
      currentField.focus();
      setCurrentField(null);
      return;
    }
    const otherErrors = Object.keys(errors).filter((key) => key !== currentField.name);
    if (otherErrors.length) {
      const element = wrapperRef.current.querySelector(`[name="${otherErrors[0]}"]`) as HTMLInputElement;
      element.focus();
      setCurrentField(null);
      return;
    }
    setCurrentField(null);
    handleSubmit();
  }, [currentField]);

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "Enter" && isSubmitting === false) {
      event.preventDefault();

      const currentField = event.target as HTMLInputElement;
      if (!submitOnEnter || (submitOnEnter !== true && !submitOnEnter.includes(currentField.name))) {
        return;
      }
      validateForm();
      setCurrentField(currentField);
    }
  };

  return null;
}
