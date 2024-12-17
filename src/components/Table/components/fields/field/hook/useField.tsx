import React from "react";
import { truncate } from "@/components/Table/components/fields/field/utils";
import { notEqual } from "@9yco/utils.utils";
import { isEqual, isFunction, isString, startCase, toLower } from "lodash";
import { FieldContext, FieldProps } from "@/components/Table/components/fields/field";
import { compose } from "lodash/fp";

// Right now we don't have defined small and large in terms of width so this is guess. We should modify it when needed.
const truncateLengthConfig: Record<FieldProps["size"], number> = {
  small: 12,
  medium: 24,
  large: 36,
};

export function useField(props: FieldProps) {
  const { rowData, defaultValue } = props;

  const value = props.value;

  const hasValue = Boolean(value) && notEqual(value, defaultValue);

  const hasOnClick = props.hasRowClick || Boolean(props.onClick);

  const dataInput = { rowData, value };

  const isHidden = isFunction(props.isHidden) ? props.isHidden(dataInput) : Boolean(props.isHidden);

  const rawFieldValue = useBuildFieldValue({ ...props, onClick });

  const { value: fieldValue } = compose(useTitleCaseField, useTruncateFieldValue)({ ...props, value: rawFieldValue });

  const isDefaultValue = isEqual(fieldValue, defaultValue);

  const showTitle = props.truncate && notEqual(fieldValue, rawFieldValue);

  function onClick(event: React.SyntheticEvent) {
    event.persist();
    props.onClick && props.onClick(dataInput);
  }

  return { isHidden, fieldValue, rawFieldValue, onClick, hasOnClick, hasValue, isDefaultValue, showTitle };
}

function renderChildren(children: (context: FieldContext) => React.ReactNode, context: any) {
  return isFunction(children) ? children(context) : children;
}

function useTruncateFieldValue(props: FieldProps) {
  const { value: fieldValue } = props;

  if (isString(fieldValue) && notEqual(fieldValue, props.defaultValue) && props.truncate) {
    return {
      ...props,
      value: truncate(fieldValue, truncateLengthConfig[props.size ?? "medium"], props.truncate),
    };
  }

  return props;
}

function useTitleCaseField(props: FieldProps) {
  const { value: fieldValue } = props;

  function parseToTitleCase(value: string): string {
    return value
      .split(/(?<=[-,.])|(?=[-,.])/)
      .map((part) => {
        if (part === ",") {
          return part + " ";
        }
        return part.match(/[-,.]/) ? part : startCase(toLower(part));
      })
      .join("");
  }

  if (isString(fieldValue) && notEqual(fieldValue, props.defaultValue) && props.case === "titleCase") {
    return {
      ...props,
      value: parseToTitleCase(fieldValue),
    };
  }

  return props;
}

function useBuildFieldValue(props: Omit<FieldProps, "onClick"> & { onClick: React.MouseEventHandler }) {
  const { children, rowData, defaultValue } = props;

  const value = props.value;

  const content = isFunction(children)
    ? renderChildren(children, { data: rowData, value, defaultValue, onClick: props.onClick })
    : value;

  return [null, undefined].includes(content) || content === "" ? props.defaultValue : content;
}
