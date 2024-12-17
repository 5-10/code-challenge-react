import React from "react";
import useFormContext from "@/components/Form/hooks/use-form-context";
import { getStepErrors, objectKeysAsArray } from "@/components/Form/components/FormWizard/utils";
import { AnyObject, notEmpty } from "@9yco/utils.utils";
import { FormContext } from "@/components/Form";
import { UseFormWizardStep } from "@/components/Form/components/FormWizard/hooks/use-form-wizard-step";
import { set } from "lodash/fp";

export const FormWizardContext = React.createContext<UseFormWizardStep>({} as UseFormWizardStep);

type FormWizardContext = ReturnType<typeof useFormWizardContext>;

export default function useFormWizardContext() {
  const formContext = useFormContext();

  const formWizardContext = React.useContext(FormWizardContext);

  function validateStepData(formContext: FormContext): () => Promise<AnyObject> {
    return async function () {
      const stepErrors = await getStepErrors(formContext)();

      if (notEmpty(stepErrors)) {
        setFormErrors(stepErrors);
      }

      return stepErrors;
    };
  }

  function scrollIntoViewErroredComponent(errors: AnyObject) {
    const invalidStepElementsTopValue = objectKeysAsArray(errors)
      .map((key) => {
        const meta = formContext.getFieldMeta(key);

        if (meta.error) {
          return document.querySelector(`[name="${key}"]`)?.getBoundingClientRect()?.top;
        }

        return false;
      })
      .filter(Boolean) as number[];

    const highestTopElementNotInViewport = Math.min(...invalidStepElementsTopValue);

    if (highestTopElementNotInViewport) {
      setTimeout(
        () =>
          window.scrollTo({
            top: highestTopElementNotInViewport,
            behavior: "smooth",
          }),
        200,
      );
    }
  }

  function setFormError(name: string, error: string) {
    const newErrors = set(name, error, formContext.errors);

    formContext.setErrors(newErrors);

    scrollIntoViewErroredComponent(newErrors);
  }

  function setFormErrors(errors: AnyObject) {
    formContext.setErrors(errors);

    scrollIntoViewErroredComponent(errors);
  }

  return {
    ...formWizardContext,
    validateStepData: validateStepData(formContext),
    getStepErrors: getStepErrors(formContext),
    setFormError,
    setFormErrors,
  };
}
