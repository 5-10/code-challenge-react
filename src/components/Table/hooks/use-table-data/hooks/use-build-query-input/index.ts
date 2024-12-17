import { UseFilter } from "@/components/Table/hooks/use-filter";
import { PaginationProps } from "@/components/Table/hooks/use-pagination";
import { TableContext } from "@/components/Table/hooks/use-table";
import { OrderByObject } from "@/components/Table/hooks/use-order-by";
import { notEmpty } from "@9yco/utils.utils";

export interface QueryInput {
  filter?: UseFilter["filter"];
  orderBy?: OrderByObject;
  sort?: string;
  search?: {
    query: string;
    fields: string[];
  };
  pagination?: {
    offset?: {
      page: PaginationProps["page"];
      perPage: PaginationProps["perPage"];
    };
    cursor?: {
      before?: string;
      after?: string;
      first?: number;
      last?: number;
    };
  };
}

export function buildQueryInput(context: TableContext): QueryInput {
  const startCursor = context.getStartCursor();
  const endCursor = context.getEndCursor();

  const cursor = context.isForwardPaging()
    ? { after: endCursor, first: context.perPage }
    : { before: startCursor, last: context.perPage };

  const offset = { page: context.page, perPage: context.perPage };

  const pagination = {
    ...(context.isCursorPagination() && { cursor }),
    ...(context.isOffsetPagination() && { offset }),
  };

  return {
    ...(notEmpty(context.filter) && { filter: context.filter }),
    ...(notEmpty(context.orderBy) && { orderBy: context.orderBy }),
    ...(context.sortString && { sort: context.sortString }),
    ...(context.isSearchSet() && { search: context.search }),
    pagination,
  };
}

export default function useBuildQueryInput() {
  return buildQueryInput;
}
