import React from "react";
import useTableContext from "@/components/Table/hooks/use-table-context";
import { isFunction } from "lodash";
import { UseTable } from "@/components/Table/hooks/use-table";

export interface TableContextChildrenProps {
  children?: React.PropsWithChildren["children"] | TableContextChildrenFunction;
}

export type TableContextChildrenFunction = (tableContext: UseTable) => React.ReactNode;

export function useChildrenFunctionWithTableContext(props: TableContextChildrenProps): React.ReactNode {
  const tableContext = useTableContext();

  return isFunction(props.children) ? props.children(tableContext) : props.children;
}
