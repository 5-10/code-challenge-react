import React from "react";
import Form, { FormContext, FormProps } from "@/components/Form";
import If from "@/components/If";
import FormWizardHeader from "./components/form-wizard-header";
import useFormWizardStep, { UseFormWizardStep } from "./hooks/use-form-wizard-step";
import { useFormWizard } from "@/components/Form/components/FormWizard/hooks/use-form-wizard";
import { FormWizardChildren } from "@/components/Form/components/FormWizard/types";
import { noop } from "lodash";
import { FormWizardContext } from "@/components/Form/components/FormWizard/hooks/use-form-wizard-context";

export interface FormWizardProps extends FormProps {
  children: FormWizardChildren;
  step?: number;
  headers?: (string | React.ReactElement)[];
  className?: string;
  onStepChange?(step: number): void;
  Header?(props: HeaderProps): React.ReactNode;
}

export interface HeaderProps {
  form: FormContext;
  formWizardStepContext: UseFormWizardStep;
}

export default function FormWizard({ className, ...props }: FormWizardProps): JSX.Element {
  const { onSubmit, initialValues, validationSchema } = props;

  const formWizardStepContext = useFormWizardStep(props);

  const { parseStepElements, stepRenderer } = useFormWizard(props, formWizardStepContext);

  const { step, previousStep, handleOnSubmit } = formWizardStepContext;

  return (
    <FormWizardContext.Provider value={formWizardStepContext}>
      <Form
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleOnSubmit}
        submitOnEnter={props.submitOnEnter}
      >
        {(form) => {
          const stepElements = parseStepElements(form);

          return (
            <Form.FieldSet>
              <If condition={props.headers}>
                <If.Then>
                  <FormWizardHeader step={step} tabs={props.headers} previousStep={previousStep(form)} />
                </If.Then>
                <If.Else>{props.Header && props.Header({ form, formWizardStepContext })}</If.Else>
              </If>
              {React.Children.map(stepElements, stepRenderer(form))}
            </Form.FieldSet>
          );
        }}
      </Form>
    </FormWizardContext.Provider>
  );
}

FormWizard.defaultProps = {
  step: 1,
  onStepChange: noop,
};
