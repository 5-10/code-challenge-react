import React from "react";
import useDataFromFetcher, {
  UseDataFromFetcher,
} from "@/components/Table/hooks/use-table-data/hooks/use-data-from-fetcher";
import useData, { UseData } from "@/components/Table/hooks/use-table-data/hooks/use-data";
import { AnyObject, isDefined } from "@9yco/utils.utils";
import { TableContext } from "@/components/Table/hooks/use-table";
import { TableProps } from "@/components/Table";

export interface UseTableData {
  data: AnyObject[];
  isLoading: boolean;
  setData: React.Dispatch<React.SetStateAction<AnyObject>[]>;
  removeItem: UseData["removeItem"];
  updateItem: UseData["updateItem"];
  processFetcherResponse: UseDataFromFetcher["processFetcherResponse"];
}

export default function useTableData(props: TableProps, context: TableContext): UseTableData {
  const { data, setData, setLocallySortedAndPaginatedData, removeItem, updateItem } = useData(props, context);

  const hasExternalData = isDefined(props.data);

  const {
    isFetcher,
    fetch,
    isLoading: fetcherIsLoading,
    processFetcherResponse,
  } = useDataFromFetcher(props, {
    ...context,
    setData,
  });

  // Set initial data
  React.useEffect(() => {
    if (isFetcher) {
      fetch();
    } else if (hasExternalData) {
      setData(props.data);
    }
  }, [isFetcher]);

  // Listen to changes in context and refetch
  React.useEffect(() => {
    if (isFetcher) {
      fetch();
    } else if (hasExternalData) {
      setLocallySortedAndPaginatedData(props.data);
    }
  }, [
    props.data,
    context.page,
    context.perPage,
    context.sortString,
    context.orderBy,
    context.filterChangedTimestamp,
    context.search.query,
  ]);

  return {
    data,
    isLoading: fetcherIsLoading,
    setData,
    removeItem,
    updateItem,
    processFetcherResponse,
  };
}
