import React, { cloneElement } from "react";
import { UseFormWizardStep } from "@/components/Form/components/FormWizard/hooks/use-form-wizard-step";
import { FormContext, FormProps } from "@/components/Form";
import { FormWizardProps } from "@/components/Form/components/FormWizard";
import { FormStepComponentProps } from "@/components/Form/components/FormWizard/types";
import { notArray } from "@9yco/utils.utils";
import { compose } from "lodash/fp";
import { isFunction } from "lodash";

export function useFormWizard(props: FormWizardProps, formWizardStepContext: UseFormWizardStep) {
  const { children } = props;

  function parseStepElements(formContext: FormContext) {
    const stepElements = parseChildren(children, formContext);

    return compose(filterFalsyValues, extractChildrenFromFragment)(stepElements);
  }

  function parseChildren(children: FormProps["children"], formContext: FormContext) {
    return isFunction(children) ? children(formContext) : children;
  }

  function extractChildrenFromFragment(childrenElements: React.ReactNode) {
    if (notArray(childrenElements) && isReactFragment(childrenElements)) {
      return (childrenElements as React.ReactElement).props?.children;
    }
    return childrenElements;
  }

  function filterFalsyValues(childrenElements: React.ReactNode) {
    return Array.isArray(childrenElements) ? childrenElements.filter(Boolean) : childrenElements;
  }

  function stepRenderer(formContext: FormContext) {
    const {
      step,
      nextStep,
      nextStepWithoutValidation,
      previousStep,
      validateStepData,
      getStepErrors,
      totalSteps,
      goToStep,
      goToStepWithoutValidation,
    } = formWizardStepContext;

    return function (element: React.ReactElement, index: number) {
      if (step === index + 1) {
        return cloneElement<FormStepComponentProps>(element, {
          next: nextStep(formContext),
          nextWithoutValidation: nextStepWithoutValidation(formContext),
          previous: previousStep(formContext),
          validateStepData: validateStepData(formContext),
          getStepErrors: getStepErrors(formContext),
          hasPrevious: step > 1,
          hasNext: step < totalSteps,
          step,
          totalSteps,
          form: formContext,
          goToStep: goToStep(formContext),
          goToStepWithoutValidation: goToStepWithoutValidation(formContext),
        });
      }

      return null;
    };
  }

  return {
    parseStepElements,
    stepRenderer,
  };
}

function isReactFragment(element: React.ReactNode): boolean {
  const reactElement = element as React.ReactElement;

  if ("type" in reactElement) {
    return reactElement.type === React.Fragment;
  }

  return false;
}
