import React from "react";
import { AnyObject } from "@9yco/utils.utils";
import { OrderByObject } from "@/components/Table/hooks/use-order-by";
import { SearchType } from "@/components/Table/hooks/use-search";

export enum TableComponents {
  Table = "Table",
  Filters = "Filters",
  Field = "Field",
  Pagination = "Pagination",
  Grid = "Grid",
  Header = "Header",
}

export enum AlignMap {
  Left = "left",
  Center = "center",
  Right = "right",
}

export interface FetcherInput<Filter = AnyObject> {
  filter?: Filter;
  sort?: string;
  orderBy?: OrderByObject;
  pagination?: {
    offset?: OffsetPaginationInput;
    cursor?: CursorPaginationInput;
  };
  search?: {
    query: string;
    fields: string[];
    type?: SearchType;
  };
}

interface OffsetPaginationInput {
  page: number;
  perPage: number;
  [key: string]: any;
}

interface CursorPaginationInput {
  before?: string;
  after?: string;
  first?: number;
  last?: number;
}

interface FilterMeta {
  field: string;
  options?: FilterMetaOption[];
  stats?: FilterMetaStats;
  type: string;
}

interface FilterMetaOption {
  count?: number;
  value: string;
}

interface FilterMetaStats {
  avg: number;
  count: number;
  max: number;
  min: number;
  sum: number;
}

export interface PaginationMeta {
  count: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  filters: {
    current: FilterMeta[];
    default: FilterMeta[];
  };
  pagination: {
    cursor: {
      endCursor: string;
      startCursor: string;
      [key: string]: any;
    };
    offset: OffsetPaginationInput;
  };
}

export interface FetcherResponse<T = AnyObject> {
  data: T[];
  meta: PaginationMeta;
}

export type FetcherFunction<T = any, Filter = any> = (input: FetcherInput<Filter>) => Promise<FetcherResponse<T>>;

export type ParseQueryResponse<Response = AnyObject> = (response: Response) => FetcherResponse;

export type TableChild = React.ReactElement & {
  type: { type: TableComponents };
};

export type OnRowClick = (rowData: AnyObject, rowNumber: number) => void;
