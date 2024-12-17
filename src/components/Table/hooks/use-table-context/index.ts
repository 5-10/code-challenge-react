import React from "react";
import { TableContext, TableRefContext } from "@/components/Table";

export default function useTableContext(): TableRefContext {
  return React.useContext(TableContext) as TableRefContext;
}
