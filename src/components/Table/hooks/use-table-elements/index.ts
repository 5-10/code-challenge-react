import React from "react";
import EmptyTable from "@/components/Table/components/empty-table";
import { RequiredGridProps } from "@/components/Table/components/grid";
import { RequiredFormFilterProps } from "@/components/Table/components/form-filters";
import { TableProps } from "@/components/Table";
import { TableChild } from "@/components/Table/types";
import { TableComponents } from "@/components/Table/types";
import { UseTable } from "@/components/Table/hooks/use-table";
import { set } from "lodash/fp";

type UseTableElements<T = typeof defaultTableElements> = {
  [K in keyof T]: React.ReactElement | null;
};

const defaultTableElements = {
  paginationElement: null,
  filterElement: null,
  gridElement: null,
  headerElement: null,
} as const;

const tableElementsMap = new Map([
  [TableComponents.Pagination, "paginationElement"],
  [TableComponents.Filters, "filterElement"],
  [TableComponents.Grid, "gridElement"],
  [TableComponents.Header, "headerElement"],
]);

export default function useTableElements(props: TableProps, context: UseTable): UseTableElements {
  const elementsMap = React.useRef<UseTableElements>(defaultTableElements);

  function initTableElements() {
    resetElements();
    mapChildrenAndInitTableElements(props.children);
  }

  function mapChildrenAndInitTableElements(children: TableProps["children"]) {
    try {
      React.Children.forEach(children, processChildrenElement);
    } catch (error) {
      console.log(error, "error");
    }
  }

  function processChildrenElement(element: TableChild) {
    const { type: Component } = element || {};

    const componentType = Component?.type;

    if (tableElementsMap.has(componentType)) {
      elementsMap.current = set(
        tableElementsMap.get(componentType),
        buildTableElement({ componentType, element, props, context }),
        elementsMap.current,
      );
    } else {
      try {
        // Try to instantiate the component with props to receive elements that this component returns
        const instantiatedElement = isReactFragment(element)
          ? element.props.children
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Component(element.props);

        const instantiatedElements = Array.isArray(instantiatedElement) ? instantiatedElement : [instantiatedElement];

        instantiatedElements.forEach((instantiatedElement) => mapChildrenAndInitTableElements(instantiatedElement));
      } catch (error) {
        mapChildrenAndInitTableElements(element.props.children);
      }
    }
  }

  function resetElements() {
    elementsMap.current = defaultTableElements;
  }

  initTableElements();

  return elementsMap.current;
}

interface BuildTableElementInput {
  componentType: string;
  element: React.ReactElement;
  props: TableProps;
  context: UseTable;
}

function buildTableElement(input: BuildTableElementInput): React.ReactElement | null {
  const { componentType, element, props, context } = input;

  switch (componentType) {
    case TableComponents.Pagination:
      return React.cloneElement(element, context.getPaginationProps());
    case TableComponents.Filters:
      // eslint-disable-next-line no-case-declarations
      const filterProps: RequiredFormFilterProps = {
        setFilter: context.setFilter,
        filter: context.filter,
        setSearch: context.setSearch,
        search: context.search,
      };

      return React.cloneElement(element, filterProps);
    case TableComponents.Grid:
      // eslint-disable-next-line no-case-declarations
      const gridProps: RequiredGridProps = {
        data: context.data,
        filter: context.filter,
        getSortProps: context.getSortProps,
        isLoading: context.isLoading,
        registerFetchMoreObservableElement: context.registerFetchMoreObservableElement,
        ObservableScrollMoreComponent: context.ObservableScrollMoreComponent,
        removeItem: context.removeItem,
        updateItem: context.updateItem,
        EmptyTableComponent: props.EmptyTableComponent ?? EmptyTable,
      };

      return React.cloneElement(element, gridProps);
    case TableComponents.Header:
      return element;
    default:
      return null;
  }
}

function isReactFragment(element: React.ReactElement): boolean {
  return element.type === React.Fragment;
}
