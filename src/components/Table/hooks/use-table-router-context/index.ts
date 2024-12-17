import React from "react";
import { TableProps } from "@/components/Table";
import { TableContext } from "@/components/Table/hooks/use-table";
import { useLocation } from "@/hooks/useLocation";
import usePrevious from "@/hooks/usePrevious";
import { AnyObject, isDefined, notEmpty, notEqual } from "@9yco/utils.utils";
import { buildQueryInput, QueryInput } from "@/components/Table/hooks/use-table-data/hooks/use-build-query-input";
import { pick, pickBy } from "lodash";
import jsonCrush from "jsoncrush";

interface UseRouterTableContext {
  setTableContextToUrl(context: TableContext): void;
  removeTableContextFromUrl(name: string): void;
}

export function useRouterTableContext(props: TableProps, context: TableContext): UseRouterTableContext {
  const location = useLocation();

  const routerContext = pick(context, [
    "page",
    "perPage",
    "sortString",
    "orderBy",
    "filterChangedTimestamp",
    "search.query",
  ]);

  const previousContext = usePrevious(routerContext);

  React.useEffect(() => {
    if (props.withRouter) {
      const urlContext = removeUndefinedValuesFromObject(getTableContextFromUrl(location, props.name));

      const pagination = urlContext?.pagination;

      if (pagination?.offset?.perPage && notEqual(pagination.offset.perPage, context.perPage)) {
        context.setPerPage(pagination.offset.perPage);
      }

      if (pagination?.offset?.page && notEqual(pagination.offset.page, context.page)) {
        context.setPage(pagination.offset.page);
      }

      if (notEmpty(urlContext.filter) && notEqual(urlContext.filter, context.filter)) {
        context.setFilter(urlContext.filter);
      }

      if (urlContext.sort && notEqual(urlContext.sort, context.sortString)) {
        context.setSortString(urlContext.sort);
      }

      if (urlContext.orderBy && notEqual(urlContext.orderBy, context.orderBy)) {
        context.setOrderBy(urlContext.orderBy);
      }

      if (urlContext?.search?.query && notEqual(urlContext?.search?.query, context?.search?.query)) {
        context.setSearch(urlContext.search);
      }
    }
  }, [location.search]);

  React.useEffect(() => {
    if (props.withRouter) {
      setTableContextToUrl(context);
    } else {
      if (hasTableContextInUrl(props.name)) {
        removeTableContextFromUrl(props.name);
      }
    }
  }, [props.withRouter]);

  React.useEffect(() => {
    if (props.withRouter && previousContext && notEqual(previousContext, routerContext)) {
      setTableContextToUrl(context);
    }
  }, [
    props.withRouter,
    props.data,
    context.page,
    context.perPage,
    context.sortString,
    context.orderBy,
    context.filterChangedTimestamp,
    context.search.query,
  ]);

  function setTableContextToUrl(context: TableContext) {
    const input = buildQueryInput(context);

    const base64Input = encode(input);

    return setQueryParametersToUrl({ [props.name]: base64Input });
  }

  function hasTableContextInUrl(name: string) {
    const existingSearchParams = new URLSearchParams(location.search);

    return existingSearchParams.has(name);
  }

  function setQueryParametersToUrl(anyObject: AnyObject) {
    const tableContextSearchParams = new URLSearchParams(anyObject);

    const existingSearchParams = new URLSearchParams(location.search);

    tableContextSearchParams.forEach((value, key) => {
      existingSearchParams.set(key, value);
    });

    existingSearchParams.sort();

    // We need to wait for the next tick to update the url
    setTimeout(() => {
      window.history.replaceState({}, null, `${location.pathname}?${existingSearchParams.toString()}`);
    });
  }

  function removeTableContextFromUrl(name: string) {
    const existingSearchParams = new URLSearchParams(location.search);

    existingSearchParams.delete(name);

    window.history.replaceState({}, null, `${location.pathname}?${existingSearchParams.toString()}`);
  }

  return { setTableContextToUrl, removeTableContextFromUrl };
}

export function useTableContextFromUrl<T = QueryInput>(name: string) {
  const location = useLocation();

  const urlContext = getTableContextFromUrl(location, name);

  return {
    input: removeUndefinedValuesFromObject(urlContext) as T,
  };
}

function removeUndefinedValuesFromObject(input: QueryInput): Partial<QueryInput> {
  return pickBy(
    {
      filter: input?.filter,
      sort: input?.sort,
      orderBy: input?.orderBy,
      pagination: input?.pagination,
      search: input?.search,
    },
    isDefined,
  );
}

export function getTableContextFromUrl(location: any, name: string): QueryInput | undefined {
  const encodedInput = new URLSearchParams(location.search).get(name);

  if (encodedInput) {
    try {
      return decode(encodedInput);
    } catch (error) {
      // TODO: figure out how to make table rebuild the url state here
    }
  }
}

function decode(encoded: string) {
  return JSON.parse(jsonCrush.uncrush(atob(encoded)));
}

function encode(data: AnyObject) {
  return btoa(jsonCrush.crush(JSON.stringify(data)));
}
