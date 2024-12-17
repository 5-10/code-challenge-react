import React from "react";
import { AnyObject } from "@9yco/utils.utils";
import { TableContext } from "@/components/Table/hooks/use-table";
import { FetcherFunction, FetcherInput, FetcherResponse, ParseQueryResponse } from "@/components/Table/types";

import { set, uniqueId } from "lodash/fp";

export interface UseTableInfiniteScroll {
  ObservableScrollMoreComponent: React.FunctionComponent;
  registerFetchMoreObservableElement(observableElement: HTMLElement): void;
}

interface UseTableInfiniteScrollProps {
  input: FetcherInput;
  context: TableContext;
  setData: React.Dispatch<React.SetStateAction<AnyObject[]>>;
  isLoading: boolean;
  refetch: FetcherFunction;
  parseQueryResponse: ParseQueryResponse;
}

export default function useTableInfiniteScroll(props: UseTableInfiniteScrollProps): UseTableInfiniteScroll {
  const { context } = props;

  const { setPage, getPage } = usePageMap();

  const { setCursor, getCursor } = useCursorMap();

  function processFetchMoreDataResult(result: FetcherResponse) {
    // Concat the result with the data from state
    const { meta, data } = props.parseQueryResponse(result);

    context.setCount(context.count + meta.count);

    context.setTotalCount(meta.totalCount);

    if (data) {
      props.setData((currentData: AnyObject[]) => [...currentData, ...data]);
    }
  }

  function fetchMore() {
    const currentPage = getPage() ?? 1;

    const cursor = getCursor() || context.getEndCursor();

    const fetchMoreInput = cursor
      ? set("pagination.cursor.after", cursor, props.input)
      : set("pagination.offset.page", currentPage + 1, props.input);

    return props.refetch(fetchMoreInput).then((response: FetcherResponse) => {
      if (cursor) {
        setCursor(response.meta?.pagination?.cursor.endCursor);
      } else {
        setPage(currentPage + 1);
      }

      processFetchMoreDataResult(response);

      return response;
    });
  }

  function registerFetchMoreObservableElement(observableElement: HTMLElement) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const tableIsNotInLoadingState = !props.isLoading;

        const hasNextPage = context.getPaginationProps()?.hasNextPage;

        if (tableIsNotInLoadingState && hasNextPage) {
          fetchMore();
        }
      }
    });

    if (observableElement) {
      observer.observe(observableElement);
    }
  }

  function ObservableScrollMoreComponent() {
    const observerElement = React.useRef<HTMLDivElement | undefined>(undefined);

    React.useEffect(() => {
      if (observerElement.current) {
        registerFetchMoreObservableElement(observerElement.current);
      }
    }, []);

    return <div ref={observerElement} className="h-50 flex w-full flex-col" />;
  }

  return {
    ObservableScrollMoreComponent,
    registerFetchMoreObservableElement,
  };
}

interface UseCursorMap {
  setCursor(cursor: string): void;
  getCursor(): string | undefined;
  removeCursor(): void;
  cursor: string | undefined;
}

function useCursorMap(): UseCursorMap {
  const cursorMap = React.useRef(new Map());

  const id = React.useRef(uniqueId("table-"));

  React.useEffect(() => {
    return removeCursor;
  }, []);

  function setCursor(cursor: string) {
    cursorMap.current.set(id.current, cursor);
  }

  function getCursor() {
    return cursorMap.current.get(id.current);
  }

  function removeCursor() {
    cursorMap.current.delete(id.current);
  }

  return { setCursor, getCursor, removeCursor, cursor: getCursor() };
}

interface UsePageMap {
  setPage(page: number): void;
  getPage(): number | undefined;
  removePageMap(): void;
}

function usePageMap(): UsePageMap {
  const pageMap = React.useRef(new Map());

  const id = React.useRef(uniqueId("table-"));

  React.useEffect(() => {
    return removePageMap;
  }, []);

  function setPage(page: number) {
    pageMap.current.set(id.current, page);
  }

  function getPage() {
    return pageMap.current.get(id.current);
  }

  function removePageMap() {
    pageMap.current.delete(id.current);
  }

  return { setPage, getPage, removePageMap };
}
