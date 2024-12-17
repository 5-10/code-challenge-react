import React from "react";
import { AnyObject, notEqual, RequireAtLeastOne } from "@9yco/utils.utils";
import { compose, set } from "lodash/fp";
import { TableProps } from "@/components/Table";
import { TableContext } from "@/components/Table/hooks/use-table";

type UpdateItemOptions = RequireAtLeastOne<{ identifierKey: string; index: number }, "index" | "identifierKey">;

export interface UseData {
  data: AnyObject[];
  setData: React.Dispatch<React.SetStateAction<AnyObject[]>>;
  setLocallySortedAndPaginatedData(data: AnyObject[]): void;
  removeItem(item: any): void;
  updateItem(item: any, options: UpdateItemOptions): void;
}

export default function useData(props: TableProps, context: TableContext): UseData {
  const [data, setData] = React.useState(props.data ?? []);

  function removeItem(itemToRemove: any) {
    setData((data) => data.filter((item) => notEqual(item, itemToRemove)));
  }

  function updateItem(item: any, options: UpdateItemOptions): void {
    setData((data) => {
      if (options.index) {
        return set(options.index, item, data);
      }

      if (options.identifierKey) {
        return data.map((itemInData) =>
          itemInData[options.identifierKey] === item[options.identifierKey] ? item : itemInData,
        );
      }
      return data;
    });
  }

  function setLocallySortedAndPaginatedData(data: AnyObject[]) {
    const sortedAndPaginatedData = compose(
      (data) =>
        context.paginateData(data as AnyObject[], {
          page: context.page,
          perPage: context.perPage,
        }),
      (data) => context.applyLocalFilters(data as AnyObject[], context.filter),
      (data) => context.sortData(data, context.sortString),
    )(data);

    context.setCount(Math.ceil(sortedAndPaginatedData.length / context.perPage));

    context.setTotalCount(data?.length ?? 0);

    setData(sortedAndPaginatedData);
  }

  return {
    data,
    setData,
    setLocallySortedAndPaginatedData,
    removeItem,
    updateItem,
  };
}
