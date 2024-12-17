import { useFormikContext, FormikContextType } from "formik";
import { AnyObject } from "@9yco/utils.utils";
import { set } from "lodash/fp";

export type FormContext<Values = AnyObject> = FormikContextType<Values> & {
  setFormError(name: string, error: string): void;
  setFormErrors(errors: AnyObject): void;
  getFieldValue(name: string, defaultValue?: any): any;
};

export default function useFormContext<Values = AnyObject>(): FormContext<Values> {
  const formContext = useFormikContext<Values>();

  return buildFormContext(formContext);
}

export function buildFormContext<Values>(formContext: FormikContextType<any>): FormContext<Values> {
  function setFormErrors(errors: Values) {
    formContext.setErrors(errors as any);

    scrollIntoViewInvalidComponent(errors);
  }

  function setFormError(name: string, error: string) {
    const newErrors = set(name, error, formContext.errors);
    formContext.setErrors(newErrors);

    scrollIntoViewInvalidComponent(newErrors);
  }

  function getFieldValue(name: string, defaultValue?: any) {
    return formContext.getFieldProps(name)?.value ?? defaultValue;
  }

  return { ...formContext, setFormError, setFormErrors, getFieldValue };
}

function objectKeysAsArray(anyObject: AnyObject) {
  const isObject = (value: any) => value && typeof value === "object" && !Array.isArray(value);

  const addDelimiter = (a: string, b: string) => (a ? `${a}.${b}` : b);

  function paths(anyObject = {}, head = ""): string[] {
    return Object.entries(anyObject).reduce((product, [key, value]) => {
      const fullPath = addDelimiter(head, key);

      return isObject(value) ? product.concat(paths(value, fullPath)) : product.concat(fullPath);
    }, []);
  }

  return paths(anyObject);
}

function scrollIntoViewInvalidComponent(errors: AnyObject) {
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
