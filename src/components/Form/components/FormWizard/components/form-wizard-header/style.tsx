import React from "react";

export function List({ children }: React.PropsWithChildren) {
  return <ol className={`m-5 flex list-none flex-row justify-start p-0 text-black sm:justify-start`}>{children}</ol>;
}

interface ItemProps {
  isActionable?: boolean;
  active: boolean;
  onClick?(): void;
}

export function Item({ isActionable, active, children, onClick }: React.PropsWithChildren<ItemProps>) {
  return (
    <li
      onClick={onClick}
      className={`mr-4 text-lg font-semibold
      ${isActionable ? "cursor-pointer" : "cursor-default"}
      ${active ? "border-black-600 border-b-2" : ""}
      sm:mr-8`}
    >
      {children}
    </li>
  );
}
