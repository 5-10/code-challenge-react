import React from "react";
import NoDataIcon from "./icons/no-data";
export interface EmptyProps {
  message?: React.ReactNode;
  children?: React.ReactElement;
}

function Empty(props: EmptyProps) {
  const { children } = props;

  const message = props.message || (
    <div className="10px m-0 flex w-full flex-col items-center p-20">
      <NoDataIcon />
      <div className="mt-0 flex justify-center text-xl font-semibold">{"Nothing to show"}</div>
    </div>
  );

  // Convert this to tailwind classes
  const className = "flex flex-col items-start box-border  border-radius-0 mb-20 h-200 w-full";

  return (
    <div className={className} data-type="table-empty-container">
      {children || message}
    </div>
  );
}

export default Empty;
