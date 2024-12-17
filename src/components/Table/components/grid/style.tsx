import React from "react";

export function StyledTable(props: React.PropsWithChildren) {
  const { children, ...rest } = props;
  return (
    <div className="max-w-full overflow-x-auto no-scrollbar">
      <table className="table min-w-full divide-y divide-BorderGray" {...rest}>
        {children}
      </table>
    </div>
  );
}

export function StyledHeader(props: React.PropsWithChildren) {
  const { children, ...rest } = props;

  return (
    <thead {...rest} className="border-b border-t border-BorderGray table-header-group">
      <tr>{children}</tr>
    </thead>
  );
}

export function StyledHeaderEmptyState() {
  return <div className="border-t border-BorderGray w-full" />;
}

export function StyledBody(props: React.PropsWithChildren) {
  const { children, ...rest } = props;
  return (
    <tbody {...rest} className="divide-y divide-BorderGray bg-white">
      {children}
    </tbody>
  );
}

export function TableRow(
  props: React.PropsWithChildren<{
    onClick: React.MouseEventHandler<HTMLElement>;
  }>,
) {
  const { children, ...rest } = props;
  const className = "py-2 table-row ";

  return (
    <tr {...rest} className={className}>
      {children}
    </tr>
  );
}
