import React from "react";
import usePrevious from "@/hooks/usePrevious";
import { useTableContextFromUrl } from "@/components/Table/hooks/use-table-router-context";
import { TableData } from "@/components/Table/hooks/use-table";
import { PaginationMeta } from "@/components/Table/types";
import { UseTableInput } from "@/components/Table/hooks/use-table";
import { notEmpty } from "@9yco/utils.utils";

export interface UsePaginationInput {
  page?: number;
  perPage?: number;
  perPageOptions?: number[];
  onPageChange?(page: number): void;
  onPerPageChange?(perPage: number): void;
  withRouter?: boolean;
}

export interface PaginationProps {
  page: number;
  perPage: number;
  perPageOptions: number[];
  count: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPerPage(perPage: number): void;
  setPage(page: number): void;
  getPaginationProps(): PaginationProps;
  paginateData(data: TableData, options: { page: number; perPage: number }): TableData;
  previousPage(): void;
  nextPage(): void;
  setCount(number: number): void;
  setTotalCount(number: number): void;
  setPaginationMeta(meta: PaginationMeta): void;
  isBackwardPaging(): boolean;
  isForwardPaging(): boolean;
  paginationMeta: PaginationMeta | null;
  getEndCursor(): string;
  getStartCursor(): string;
  isCursorPagination(): boolean;
  isOffsetPagination(): boolean;
  backToFirstPage(): void;
  hasFilterMeta(): boolean;
}

export default function usePagination(input: UseTableInput): PaginationProps {
  const { input: urlContext } = useTableContextFromUrl(input.name);

  const pagination = urlContext?.pagination;

  const defaultPage = input.withRouter ? pagination?.offset?.page ?? input.page ?? 1 : input.page ?? 1;

  const defaultPerPage = input.withRouter ? pagination?.offset?.perPage ?? input.perPage ?? 10 : input.perPage ?? 10;

  const [page, setPageState] = React.useState(defaultPage);

  const currentPage = usePrevious(page);

  const [perPage, setPerPageState] = React.useState(defaultPerPage);

  const [count, setCount] = React.useState(0);

  const [paginationMeta, setPaginationMeta] = React.useState<PaginationMeta>(null);

  const [totalCount, setTotalCount] = React.useState(0);

  const perPageOptions = input.perPageOptions ?? [10, 20, 50];

  const totalPages = totalCount ? Math.ceil(totalCount / perPage) || 1 : 0;

  const hasNextPage = paginationMeta?.hasNextPage ?? totalPages > page;

  const hasPreviousPage = paginationMeta?.hasPreviousPage ?? (totalPages > 1 && page > 1);

  function setPage(newPage: number): void {
    if (page !== newPage) {
      setPageState(newPage);
      input.onPageChange && input.onPageChange(newPage);
    }
  }

  function setPerPage(newPerPage: number): void {
    if (perPageOptions.includes(newPerPage) && newPerPage !== perPage) {
      setPerPageState(newPerPage);
      setPageState(1);

      input.onPageChange && input.onPageChange(newPerPage);

      return;
    }

    throw new Error("Unsupported perPage value");
  }

  function previousPage() {
    if (page === 1) {
      return;
    }
    const newPage = page - 1;

    setPageState(newPage);
    input.onPageChange && input.onPageChange(newPage);
  }

  function nextPage() {
    if (page === totalPages) {
      return;
    }
    const newPage = page + 1;

    setPageState(newPage);

    input.onPageChange && input.onPageChange(newPage);
  }

  function isBackwardPaging() {
    return currentPage && currentPage > page;
  }

  function isForwardPaging() {
    if (currentPage) {
      return currentPage && currentPage < page;
    }

    return true;
  }

  function isCursorPagination() {
    return Boolean(paginationMeta?.pagination?.cursor);
  }

  function isOffsetPagination() {
    return isCursorPagination() === false;
  }

  function getEndCursor() {
    return paginationMeta?.pagination?.cursor?.endCursor;
  }

  function getStartCursor() {
    return paginationMeta?.pagination?.cursor?.startCursor;
  }

  function backToFirstPage() {
    if (isCursorPagination() === false) {
      setPage(1);
    }
  }

  function hasFilterMeta() {
    return notEmpty(paginationMeta?.filters?.default);
  }

  const state = {
    page,
    perPage,
    count,
    totalCount,
    totalPages,
    setCount,
    setTotalCount,
    setPage,
    setPerPage,
    getPaginationProps,
    perPageOptions,
    paginateData,
    previousPage,
    nextPage,
    hasNextPage,
    hasPreviousPage,
    isBackwardPaging,
    isForwardPaging,
    setPaginationMeta,
    paginationMeta,
    isCursorPagination,
    isOffsetPagination,
    getEndCursor,
    getStartCursor,
    backToFirstPage,
    hasFilterMeta,
  };

  function getPaginationProps(): PaginationProps {
    return state;
  }

  return state;
}

export function paginateData(data: any[], { perPage, page }: { page: number; perPage: number }) {
  if (page && perPage) {
    return data.slice((page - 1) * perPage, page * perPage);
  }
  return data;
}
