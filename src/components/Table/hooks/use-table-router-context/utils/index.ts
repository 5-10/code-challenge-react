import { get, isString } from "lodash";
import { AnyObject } from "@9yco/utils.utils";

export function getInitialSearch(props: any) {
  return {
    query: undefined,
    operator: get(props.search, "operator", "OR"),
    fields: get(props.search, "fields"),
  };
}

export const jsonParseObjectValues = (object: AnyObject) => {
  return Object.entries(object).reduce((object, [name, value]) => {
    try {
      if (isString(value)) {
        value = JSON.parse(value as any);
      }
    } catch {
      // Do nothing
    }

    return {
      ...object,
      [name]: value,
    };
  }, {});
};

export const jsonStringifyObjectValues = (object: AnyObject) => {
  return Object.entries(object).reduce(
    (object, [name, value]) => ({
      ...object,
      [name]: JSON.stringify(value),
    }),
    {},
  );
};
