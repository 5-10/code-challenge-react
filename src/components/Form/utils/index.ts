import { isArray, isPlainObject, omit, isEmpty } from "lodash";

export function removeTypeName(object = {}) {
  return Object.entries(object).reduce((parsedObject, [key, value]) => {
    if (key === "__typename") {
      return parsedObject;
    }

    let keyValue = value;

    if (isPlainObject(value)) {
      keyValue = removeTypeName(omit(value as any, ["__typename"]));
    }

    if (isArray(value) && isEmpty(value) === false) {
      keyValue = (value as Array<any>).map((item) => {
        if (isPlainObject(item)) {
          return removeTypeName(omit(item, ["__typename"]));
        }

        return item;
      });
    }

    return { ...parsedObject, [key]: keyValue };
  }, {});
}
