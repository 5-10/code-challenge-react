import React from "react";
import { get, invert, isPlainObject, orderBy } from "lodash";
import { TableData } from "@/components/Table/hooks/use-table";
import { useTableContextFromUrl } from "@/components/Table/hooks/use-table-router-context";
import useOrderBy, { UseOrderBy, UseOrderByInput, OrderByMap } from "@/components/Table/hooks/use-order-by";

export enum SortMap {
  Asc = "ASC",
  Desc = "DESC",
}

export type SortObject = Record<string, SortMap>;

export const SORT_SIGN = {
  [SortMap.Asc]: "-",
  [SortMap.Desc]: "+",
};

export interface UseSortInput {
  withRouter?: boolean;
}

export interface UseSort extends UseOrderBy {
  sortString: string;
  sort: SortObject;
  toggleSort(fieldName: string): void;
  getSortValue(fieldName: string): SortMap | undefined;
  getSortProps(): UseSort;
  sortData(data: TableData, sortString: string): TableData;
  setSortString(sortString: string): void;
  isAscending(fieldName: string): boolean;
  isDescending(fieldName: string): boolean;
}

export default function useSort(input: UseOrderByInput): UseSort {
  const { input: urlContext } = useTableContextFromUrl(input.name);

  const isV2 = input.v2;

  const defaultSort = input.withRouter
    ? urlContext?.sort ?? sortObjectToString(input.sort)
    : sortObjectToString(input.sort);

  const [sortString, setSortString] = React.useState(defaultSort);

  const { orderBy, setOrderBy, toggleOrderBy } = useOrderBy(input);

  const sortMap = new Map<string, SortMap>(sortFromString(sortString));

  function toggleSort(fieldName: string): void {
    if (isV2) {
      toggleOrderBy(fieldName);
    } else {
      // Sort cycle goes from ASC, DESC to unset...we check each state
      switch (sortMap.get(fieldName)) {
        case SortMap.Desc:
          sortMap.has(fieldName) && sortMap.delete(fieldName);
          break;
        case SortMap.Asc:
          sortMap.set(fieldName, SortMap.Desc);
          break;
        default:
          sortMap.set(fieldName, SortMap.Asc);
      }

      const newSortString = sortToString();

      setSortString(newSortString);

      input.backToFirstPage();
    }
  }

  function sortToString() {
    return [...sortMap].map(([name, value]) => `${SORT_SIGN[value]}${name}`).join(",");
  }

  function sortObjectToString(sortObject: SortObject) {
    if (isPlainObject(sortObject)) {
      return Object.entries(sortObject)
        .map(([name, value]) => `${SORT_SIGN[value]}${name}`)
        .join(",");
    }
    return "";
  }

  function getSortValue(fieldName: string) {
    if (isV2) {
      return orderBy[fieldName] as any;
    }
    return sortMap.get(fieldName);
  }

  function isAscending(fieldName: string) {
    const sortValue = getSortValue(fieldName);

    if (isV2) {
      return sortValue === OrderByMap.Asc;
    }

    return sortValue === SortMap.Asc;
  }

  function isDescending(fieldName: string) {
    const sortValue = getSortValue(fieldName);

    if (isV2) {
      return sortValue === OrderByMap.Desc;
    }

    return sortValue === SortMap.Desc;
  }

  function getSortProps(): UseSort {
    return state;
  }

  const state = {
    sortString,
    toggleSort,
    sort: Object.fromEntries(sortMap),
    getSortProps,
    getSortValue,
    sortData,
    setSortString,
    orderBy,
    setOrderBy,
    toggleOrderBy,
    isAscending,
    isDescending,
  };

  return state;
}

export function sortData(data: TableData, sortString: string): TableData {
  const sortMap = new Map<string, SortMap>(sortFromString(sortString));
  if (sortString) {
    const { fields, order } = [...sortMap].reduce<{
      fields: string[];
      order: any[];
    }>(
      (sortParameters, [field, sortValue]) => {
        sortParameters.fields.push(field);
        sortParameters.order.push(sortValue?.toLowerCase());
        return sortParameters;
      },
      { fields: [], order: [] },
    );

    return orderBy(data, fields, order);
  }

  return data;
}

function sortFromString(sort = ""): [string, SortMap][] {
  function parseSortString(sortString: string): [string, SortMap] {
    const [sortSign] = sortString;
    const [_, fieldName] = sortString.split(sortSign);

    return [fieldName, get(invert(SORT_SIGN), sortSign) as SortMap];
  }

  return sort.split(",").filter(Boolean).map(parseSortString);
}
