import { FormContext } from "@/components/Form";
import { AnyObject } from "@9yco/utils.utils";
import { set } from "lodash/fp";
import { get } from "lodash";

export function getStepErrors(formContext: FormContext): () => Promise<AnyObject> {
  return async function () {
    const errors = await formContext.validateForm(formContext.values);

    return objectKeysAsArray(errors).reduce((stepErrors, key) => {
      const element = document.querySelector(`[name="${key}"]`);

      if (element) {
        return set(key, get(errors, key), stepErrors);
      }

      return stepErrors;
    }, {});
  };
}

export function objectKeysAsArray(anyObject: AnyObject) {
  const isObject = (value: any) => value && typeof value === "object" && !Array.isArray(value);

  const addDelimiter = (a: string, b: string) => (a ? `${a}.${b}` : b);

  function paths(anyObject = {}, head = ""): string[] {
    return Object.entries(anyObject).reduce((product, [key, value]) => {
      const fullPath = addDelimiter(head, key);
      // @ts-ignore
      return isObject(value) ? product.concat(paths(value, fullPath)) : product.concat(fullPath);
    }, []);
  }

  return paths(anyObject);
}
