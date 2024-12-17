import React from "react";

export function Container(props: React.PropsWithChildren) {
  return <div className="inline-block min-w-full max-w-full align-middle">{props.children}</div>;
}

export interface TableHeaderProps {
  title: string;
  subTitle: string | React.ReactElement;
  children?: React.ReactElement | React.ReactElement[];
}
export function TableHeader(props: TableHeaderProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="mb-6 mt-6 text-3xl font-semibold leading-6 text-gray-900">{props.title}</h1>
          <p className="mt-2 text-sm text-gray-700">{props.subTitle}</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">{props.children}</div>
      </div>
    </div>
  );
}
