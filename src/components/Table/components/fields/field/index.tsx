import React from "react";
import { TableComponents, AlignMap } from "@/components/Table/types";
import { useField } from "@/components/Table/components/fields/field/hook/useField";
import { StyledField } from "./style";
import { isFunction } from "lodash";
import { AnyObject } from "@9yco/utils.utils";
import { TruncatePosition } from "@/components/Table/components/fields/field/utils";

export interface FieldProps {
  /**
   * We are also allowing field name to be unknown because it may hold more than one readable field value
   */
  name?: string | unknown;
  children?: (context: FieldContext) => React.ReactNode;
  align?: AlignMap;
  data?: AnyObject[];
  rowData?: AnyObject;
  label?: React.ReactNode;
  sortKey?: string; // defaults to name
  value?: any;
  defaultValue?: string;
  onClick?(input: FieldDataInput): void;
  isHidden?: FieldIsHidden;
  hasRowClick?: boolean;
  sortable?: boolean;
  size?: FieldSize;
  case?: FieldCase;
  truncate?: TruncatePosition;
}

export type FieldSize = "small" | "medium" | "large";

export type FieldCase = "uppercase" | "lowercase" | "capitalize" | "titleCase";

export type FieldIsHidden = ((data: FieldDataInput) => boolean) | boolean;

export interface FieldDataInput<Data = AnyObject, Value = any> {
  rowData: Data;
  value: Value;
}

export interface FieldContext<T = any, V = any> {
  data: T;
  value: V;
  defaultValue: any;
  onClick(event: React.SyntheticEvent): void;
}

function Field(props: FieldProps) {
  const { isHidden, fieldValue, rawFieldValue, onClick, hasOnClick, hasValue, isDefaultValue, showTitle } =
    useField(props);

  if (isHidden) {
    return null;
  }

  return (
    <StyledField
      data-type="field"
      data-name={props.name}
      onClick={onClick}
      size={props.size}
      case={props.case}
      title={showTitle ? rawFieldValue : undefined}
      hasOnClick={hasOnClick}
      hasValue={hasValue}
      isDefaultValue={isDefaultValue}
    >
      {fieldValue}
    </StyledField>
  );
}

Field.defaultProps = {
  align: AlignMap.Left,
  data: {},
  defaultValue: "-",
};

export function isHiddenPropRenderer(isHiddenProp: FieldIsHidden, input: { rowData: Record<string, any>; value: any }) {
  return isFunction(isHiddenProp) ? isHiddenProp(input) : Boolean(isHiddenProp);
}

Field.type = TableComponents.Field;

export default Field;
