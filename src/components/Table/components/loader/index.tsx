import React from "react";
import "./index.css";
import { TableComponents, TableChild } from "@/components/Table/types";
import { TableProps } from "@/components/Table";

import { Text } from "@/components/Typography";

export default function Loader(props: React.PropsWithChildren<Omit<TableProps, "Loader">>) {
  const [grid] = React.Children.toArray(props.children).filter(
    (element) => (element as TableChild)?.type?.type === TableComponents.Grid,
  );

  const fields = React.Children.toArray((grid as TableChild)?.props?.children).map(
    (field) => (field as TableChild)?.props?.label,
  );

  return (
    <div className="max-w-full overflow-x-auto no-scrollbar">
      <table className="table min-w-full divide-y divide-textureBorderGray">
        <thead className="border-b border-t border-textureBorderGray table-header-group">
          <tr>
            {fields.map((label, key) => (
              <th key={key} className="px-4 pb-1.5 pt-1.5 text-left gap-1 bg-white">
                <Text.DarkIndigo extraSmall>{label}</Text.DarkIndigo>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y textureBorderGray bg-white">
          {[...Array(props.perPage)].map((_, index) => {
            return (
              <tr key={index} className="py-2 table-row">
                {fields.map((label, index) => (
                  <td key={index} className="loading whitespace-nowrap px-4 h-16 text-sm text-textureDarkIndigo">
                    <div className="bar"></div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
