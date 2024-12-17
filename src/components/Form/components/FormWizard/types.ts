import { AnyObject } from "@9yco/utils.utils";
import { FormContext } from "@/components/Form";

export interface FormStepComponentProps<Values = any> {
  next(): void;
  nextWithoutValidation(): void;
  previous(): void;
  goToStep(step: number): void;
  goToStepWithoutValidation(step: number): void;
  validateStepData(): Promise<AnyObject>;
  getStepErrors(): AnyObject;
  hasPrevious: boolean;
  hasNext: boolean;
  step: number;
  totalSteps: number;
  form: FormContext<Values>;
}

export type FormWizardChildren = JSX.Element | JSX.Element[] | FormChildFunction;

type FormChildFunction = (formContext: FormContext) => JSX.Element | JSX.Element[];
