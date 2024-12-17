import React from "react";
import ColumnHeader from "@/components/Table/components/column-header";
import { get, isEmpty, isFunction, merge } from "lodash";
import { AnyObject, notEmpty } from "@9yco/utils.utils";
import { UseSort } from "@/components/Table/hooks/use-sort";
import { UseTable } from "@/components/Table/hooks/use-table";
import useGridFields from "./hooks/use-grid-fields";
import { StyledTable, StyledHeader, StyledBody, TableRow, StyledHeaderEmptyState } from "./style";
import { TableComponents } from "@/components/Table/types";
import If from "@/components/If/If";
import { isHiddenPropRenderer } from "@/components/Table/components/fields/field";

export interface GridProps {
  children: TableChild | TableChild[] | ((context: GridContext) => React.ReactElement);
  onRowClick?: OnRowClick;
  getSortProps?(): UseSort;
  rowIdentifier?: string;
}

export interface GridContext<Data = any, Filter = AnyObject> {
  isLoading?: boolean;
  data: Data[];
  filter: Filter;
  registerFetchMoreObservableElement: UseTable["registerFetchMoreObservableElement"];
  ObservableScrollMoreComponent: UseTable["ObservableScrollMoreComponent"];
  removeItem: UseTable["removeItem"];
  updateItem: UseTable["updateItem"];
}

export interface RequiredGridProps extends GridContext {
  onRowClick?: OnRowClick;
  getSortProps(): UseSort;
  EmptyTableComponent?: React.FunctionComponent;
}

export type TableChild = React.ReactElement & { type: { type: string } };

export type OnRowClick = (data: AnyObject, rowNumber: number) => void;

const defaultProps = {
  data: [],
  rowIdentifier: "id",
};

function Grid(props: GridProps) {
  const {
    data,
    filter,
    isLoading,
    registerFetchMoreObservableElement,
    ObservableScrollMoreComponent,
    removeItem,
    updateItem,
    EmptyTableComponent,
  } = props as unknown as RequiredGridProps;

  const fields = useGridFields(props);

  function onRowClick(data: AnyObject[], rowNumber: number) {
    return function () {
      props.onRowClick && props.onRowClick(data, rowNumber);
    };
  }

  function isTableEmpty(): boolean {
    return isEmpty(data) && isLoading === false;
  }

  if (isFunction(props.children)) {
    return props.children({
      data,
      isLoading,
      filter,
      registerFetchMoreObservableElement,
      ObservableScrollMoreComponent,
      removeItem,
      updateItem,
    });
  }
  const emptyTableElement = <EmptyTableComponent />;

  return (
    <>
      <StyledTable data-type="table" data-table-empty={String(isTableEmpty())}>
        { isTableEmpty() ? <StyledHeaderEmptyState /> :
          <StyledHeader>
            {fields.map((field, columnNumber) => {
              return (
                <ColumnHeader
                  key={`${field?.props?.name}:column:${columnNumber}`}
                  align={field?.props?.align}
                  label={field?.props?.label}
                  name={field?.props?.name}
                  sortKey={field?.props?.sortKey}
                  sortable={field?.props?.sortable}
                  columnNumber={columnNumber}
                  isHidden={isHiddenPropRenderer(field?.props?.isHidden, {
                    rowData: field.props.data,
                    value: field.props.value,
                  })}
                  {...(isFunction(props?.getSortProps) && props.getSortProps())}
                />
              );
            })}
          </StyledHeader>
        }

        <StyledBody>
          <If condition={notEmpty(data)}>
            {data.map((rowData, rowNumber) => {
              const key = get(rowData, props.rowIdentifier, rowNumber);

              return (
                <TableRow key={key} onClick={onRowClick(rowData, rowNumber)}>
                  {fields.map((field, columnNumber) => {
                    const name = field?.props?.name;

                    return React.cloneElement(field, {
                      data,
                      rowData,
                      key: `${name}row:${rowNumber}:column:${columnNumber}`,
                      value: name
                        ? typeof name === "string"
                          ? get(rowData, name, "-")
                          : merge(
                              {},
                              ...Object.keys(name).map((key) => ({
                                [key]: isFunction(name[key]) ? name[key](rowData) : get(rowData, name[key], "-"),
                              })),
                            )
                        : "-",
                      hasRowClick: Boolean(props.onRowClick),
                    });
                  })}
                </TableRow>
              );
            })}
          </If>
        </StyledBody>
      </StyledTable>
      <If condition={isTableEmpty()}>{emptyTableElement}</If>
    </>
  );
}

Grid.type = TableComponents.Grid;

Grid.defaultProps = defaultProps;

export default Grid;
