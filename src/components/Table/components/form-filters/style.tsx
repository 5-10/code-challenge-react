import React from "react";
import { classNames } from "@/utils";

interface ContainerProps {
  display?: "row" | "column";
}

export function Container(props: React.PropsWithChildren<ContainerProps>) {
  return <div className={classNames(props.display)}>{props.children}</div>;
}

export function Footer(props: React.PropsWithChildren<{}>) {
  return <div className="row flex items-start">{props.children}</div>;
}
