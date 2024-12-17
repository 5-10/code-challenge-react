import React from "react";
import { classNames } from "@/utils";
import { FieldCase, FieldSize } from "@/components/Table/components/fields/field/index";

export function StyledField(
  props: React.PropsWithChildren<{
    onClick?: React.MouseEventHandler<HTMLElement>;
    hasOnClick?: boolean;
    hasValue?: boolean;
    isDefaultValue?: boolean;
    size: FieldSize;
    case?: FieldCase;
    title?: string;
  }>,
) {
  const { children, isDefaultValue, hasOnClick, hasValue, size = "medium", ...rest } = props;

  const divClassName = classNames(
    size === "small" && "",
    size === "medium" && "md:min-w-[12rem] lg:min-w-[12rem]",
    size === "large" && "", // Figure it out
    props.case === "uppercase" && "uppercase",
    props.case === "lowercase" && "lowercase",
    props.case === "capitalize" && "capitalize",
    hasOnClick && hasValue
      ? "text-textureElectricBlue font-medium font-inter hover:underline"
      : "text-textureDarkIndigo",
  );

  const tdClassName = classNames(
    "whitespace-nowrap px-4 h-16 text-sm font-epilogue cursor-default",
    hasOnClick && hasValue && "cursor-pointer hover:bg-textureNeutralGray",
  );

  return (
    <td {...rest} className={tdClassName}>
      <div className={divClassName}>{children}</div>
    </td>
  );
}
