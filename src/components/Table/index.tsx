import React from "react";
import Pagination from "@/components/Table/components/pagination";
import Field from "@/components/Table/components/fields/field";
import Grid from "@/components/Table/components/grid";
import FormFilters from "@/components/Table/components/form-filters";
import If from "@/components/If/If";
import SearchTextInput from "@/components/Table/components/search-text-input";
import TableLoader from "@/components/Table/components/loader";
import useTable, { UseTable } from "@/components/Table/hooks/use-table";
import useTableElements from "@/components/Table/hooks/use-table-elements";
import { Container, TableHeader } from "./style";
import {
  TableComponents,
  FetcherFunction,
  FetcherResponse,
  ParseQueryResponse,
  OnRowClick,
  TableChild,
} from "@/components/Table/types";
import { AnyObject } from "@9yco/utils.utils";
import withForwardRef, { ForwardRefProps } from "@/hoc/withForwardRef";
import { SortObject } from "@/components/Table/hooks/use-sort";
import { OrderByObject } from "@/components/Table/hooks/use-order-by";

export type TableProps<Props = AnyObject> =
  | (Omit<TablePropsWithoutRouter, keyof Props> & Props)
  | (Omit<TablePropsWithRouter, keyof Props> & Props);

export const TableContext = React.createContext({});
interface TablePropsWithoutRouter extends ForwardRefProps<TableRefContext> {
  data?: AnyObject[];
  fetcher?: FetcherFunction;
  children: TableChild | TableChild[];
  isLoading?: boolean;
  Loader?: React.FunctionComponent<any>;
  EmptyTableComponent?: React.FunctionComponent;
  className?: string;
  onRowClick?: OnRowClick;
  perPage?: number;
  filter?: AnyObject;
  sort?: SortObject;
  skip?(context: { filter: AnyObject }): boolean;
  parseQueryResponse?: ParseQueryResponse;
  // This prop changes functionality of table sort and search in order to work with the @asPaginatedQuery directive
  v2?: boolean;
  // New sort prop that is used if v2 is true
  orderBy?: OrderByObject;
  withRouter?: never;
  name?: never;
}

interface TablePropsWithRouter extends Omit<TablePropsWithoutRouter, "withRouter" | "name"> {
  withRouter: boolean;
  name: string;
}

export type TableRefContext = UseTable;

export type { FieldContext } from "@/components/Table/components/fields/field";

export type { FormFiltersContext } from "@/components/Table/components/form-filters";

const defaultProps = {
  isLoading: false,
  parseQueryResponse: (response: any): FetcherResponse => {
    return response;
  },
};
function Table({ Loader = TableLoader, ...props }: TableProps) {
  const tableContext = useTable(props);

  React.useImperativeHandle(props.forwardedRef, () => tableContext, [tableContext]);

  const loader = <Loader {...{ ...tableContext, children: props.children }} />;

  const { gridElement, filterElement, paginationElement, headerElement } = useTableElements(props, tableContext);

  return (
    <TableContext.Provider value={tableContext}>
      <Container>
        {filterElement}
        {headerElement}
        <If condition={tableContext.isLoading || props.isLoading}>
          <If.Then>{loader}</If.Then>
          <If.Else>{gridElement}</If.Else>
        </If>
        {/* Currently we are showing pagination in header */}
        {/*{paginationElement}*/}
      </Container>
    </TableContext.Provider>
  );
}

Table.defaultProps = defaultProps;

Table.type = TableComponents.Table;

const CompoundComponents = {
  Pagination,
  Field,
  Filters: FormFilters,
  Grid,
  Header: TableHeader,
  SearchTextInput,
};

type TableCompoundComponents = typeof CompoundComponents;

export type TableComponent<Props = TableProps, CompoundComponents = {}> = React.FunctionComponent<Props> &
  TableCompoundComponents &
  CompoundComponents;

export default Object.assign(withForwardRef<TableRefContext, TableProps<AnyObject>>(Table), CompoundComponents);
