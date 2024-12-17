import React from "react";
import { AnyObject, notEmpty, notEqual } from "@9yco/utils.utils";
import { FormContext } from "@/components/Form";
import { FormWizardProps } from "@/components/Form/components/FormWizard";
import { getStepErrors, objectKeysAsArray } from "@/components/Form/components/FormWizard/utils";
export type UseFormWizardStep = ReturnType<typeof useFormWizardStep>;

export default function useFormWizardStep(props: FormWizardProps) {
  const [step, setStep] = React.useState(props.step ?? 1);

  const totalSteps = React.Children.count(props.children);

  React.useEffect(() => {
    if (props.step && notEqual(props.step, step)) {
      setStep(props.step);
    }
  }, [props.step]);

  React.useEffect(() => {
    props.onStepChange && props.onStepChange(step);
  }, [step]);

  const handleOnSubmit = (values, context) => {
    if (!props.submitOnEnter) {
      return props.onSubmit(values, context);
    }
    if (step < totalSteps) {
      return nextStep(context)();
    }
    return props.onSubmit(values, context);
  };

  function validateStepData(formContext: FormContext): () => Promise<AnyObject> {
    return async function () {
      const stepErrors = await getStepErrors(formContext)();

      if (notEmpty(stepErrors)) {
        setFormErrors(formContext)(stepErrors);
      }

      return stepErrors;
    };
  }

  function setFormErrors(formContext: any) {
    return function (errors: AnyObject) {
      formContext.setErrors(errors);

      scrollIntoViewErroredComponent(errors);
    };
  }

  function scrollIntoViewErroredComponent(errors: AnyObject) {
    const invalidStepElementsTopValue = objectKeysAsArray(errors)
      .map((key) => {
        return document.querySelector(`[name="${key}"]`)?.getBoundingClientRect()?.top;
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

  function nextStep(formContext: FormContext) {
    return async function () {
      const stepErrors = await validateStepData(formContext)();

      if (notEmpty(stepErrors)) {
        return;
      }

      nextStepWithoutValidation(formContext)();
    };
  }

  function goToStep(formContext: FormContext) {
    return async function (step: number) {
      const stepErrors = await validateStepData(formContext)();

      if (notEmpty(stepErrors)) {
        return;
      }

      goToStepWithoutValidation(formContext)(step);
    };
  }
  function nextStepWithoutValidation(formContext: FormContext) {
    return async function () {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }));

      setStep((step) => {
        if (step < totalSteps) {
          resetFormErrors(formContext);
          return step + 1;
        }
        return step;
      });
    };
  }

  function goToStepWithoutValidation(formContext: FormContext) {
    return async function (step: number) {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }));

      setStep((currentStep) => {
        if (step <= totalSteps) {
          resetFormErrors(formContext);
          return step;
        }
        return currentStep;
      });
    };
  }
  function previousStep(formContext: FormContext) {
    return function () {
      setStep((step) => {
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }));

        if (step > 1) {
          resetFormErrors(formContext);
          return step - 1;
        }
        return step;
      });
    };
  }

  function resetFormErrors(formContext: FormContext) {
    formContext.setStatus({ globalError: undefined });
    formContext.setErrors({});
  }

  return {
    step,
    totalSteps,
    nextStep,
    previousStep,
    validateStepData,
    nextStepWithoutValidation,
    getStepErrors,
    handleOnSubmit,
    goToStep,
    goToStepWithoutValidation,
  };
}
