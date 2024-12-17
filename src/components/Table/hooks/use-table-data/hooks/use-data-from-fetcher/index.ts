import { AnyObject, isDefined, notEmpty } from "@9yco/utils.utils";
import { TableProps } from "@/components/Table";
import { TableContext } from "@/components/Table/hooks/use-table";
import { buildQueryInput } from "@/components/Table/hooks/use-table-data/hooks/use-build-query-input";
import { FetcherResponse } from "@/components/Table/types";

export interface UseDataFromFetcher {
  isFetcher: boolean;
  fetch(): Promise<void>;
  isLoading: boolean;
  processFetcherResponse(response: FetcherResponse): void;
}

export default function useDataFromFetcher(
  props: TableProps,
  context: TableContext & {
    setData: React.Dispatch<React.SetStateAction<AnyObject>[]>;
  },
): UseDataFromFetcher {
  const isFetcher = isDefined(props.fetcher);

  const [isLoading, setIsLoading] = React.useState(isFetcher);

  async function fetch() {
    if (isFetcher) {
      const input = buildQueryInput(context);

      setIsLoading(true);

      props
        .fetcher(input)
        .then(processFetcherResponse)
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  function processFetcherResponse(response: FetcherResponse) {
    const { data, meta } = response || {};

    if (notEmpty(meta)) {
      context.setPaginationMeta(meta);
      meta?.count && context.setCount(meta?.count);
      meta?.totalCount && context.setTotalCount(meta.totalCount);
    }
    data && context.setData(data);
  }

  return { isFetcher, fetch, isLoading, processFetcherResponse };
}
