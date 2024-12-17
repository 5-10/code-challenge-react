import React from "react";
import useSort, { UseSort, UseSortInput } from "@/components/Table/hooks/use-sort";
import usePagination, { PaginationProps, UsePaginationInput } from "@/components/Table/hooks/use-pagination";
import { useRouterTableContext } from "@/components/Table/hooks/use-table-router-context";
import useTableData, { UseTableData } from "@/components/Table/hooks/use-table-data";
import { useFilter, UseFilter } from "@/components/Table/hooks/use-filter";
import { AnyObject } from "@9yco/utils.utils";
import { TableProps } from "@/components/Table";
import useTableInfiniteScroll, {
  UseTableInfiniteScroll,
} from "@/components/Table/hooks/use-table-data/hooks/use-table-infinite-scroll";
import { buildQueryInput } from "@/components/Table/hooks/use-table-data/hooks/use-build-query-input";
import useSearch, { UseSearch } from "@/components/Table/hooks/use-search";

export type TableData = AnyObject[];

export type UseTableInput = TableProps & UsePaginationInput & UseSortInput;

export type UseTable = {
  data: TableData;
  isLoading: UseTableData["isLoading"];
  registerFetchMoreObservableElement: UseTableInfiniteScroll["registerFetchMoreObservableElement"];
  ObservableScrollMoreComponent: UseTableInfiniteScroll["ObservableScrollMoreComponent"];
  removeItem: UseTableData["removeItem"];
  updateItem: UseTableData["updateItem"];
  setData: UseTableData["setData"];
  processFetcherResponse: UseTableData["processFetcherResponse"];
  name?: string;
} & TableContext;

export type TableContext = UseSort & PaginationProps & UseFilter & UseSearch;

export default function useTable(input: UseTableInput): UseTable {
  const pagination = usePagination(input);

  const sort = useSort({
    ...input,
    backToFirstPage: pagination.backToFirstPage,
  });

  const filter = useFilter(input);

  const search = useSearch(input);

  const context = {
    ...pagination,
    ...sort,
    ...filter,
    ...search,
    setFilter,
    name: input.name,
  };

  useRouterTableContext(input, context);

  const { data, isLoading, removeItem, updateItem, setData, processFetcherResponse } = useTableData(input, context);

  const { registerFetchMoreObservableElement, ObservableScrollMoreComponent } = useTableInfiniteScroll({
    context,
    setData,
    isLoading,
    refetch: input.fetcher,
    input: buildQueryInput(context),
    parseQueryResponse: input.parseQueryResponse,
  });

  function setFilter(input: React.SetStateAction<AnyObject>): void {
    pagination.backToFirstPage();
    filter.setFilter(input);
  }

  return {
    ...context,
    data,
    setData,
    processFetcherResponse,
    isLoading,
    registerFetchMoreObservableElement,
    ObservableScrollMoreComponent,
    removeItem,
    updateItem,
  };
}
