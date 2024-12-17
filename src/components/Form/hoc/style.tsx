import { classNames } from "@/utils";
import { Gap, Row } from "@/components/Layout";
import { WarningIcon } from "@/assets/icons/WarningIcon";
import React from "react";

export function Container(props: React.PropsWithChildren) {
  return <div>{props.children}</div>;
}

// This is probably due to font white space. I don't know better way to fix this. Leon
const hackyAlignmentFix = {
  paddingTop: "1px",
};
export function ErrorMessageComponent(props: React.PropsWithChildren) {
  const className = classNames(
    "font-inter text-xs leading-16 text-textureInvalid",
    "flex flex-col items-start gap-1 self-stretch",
    "ml-2",
  );

  return (
    <>
      <Gap px={6} />
      <Row alignItems="center">
        <WarningIcon />
        <div style={hackyAlignmentFix} className={className}>
          {React.Children.map(props.children, (child, index) => {
            if (!child) return null;
            return <div key={index}>{child}</div>;
          })}
        </div>
      </Row>
    </>
  );
}
