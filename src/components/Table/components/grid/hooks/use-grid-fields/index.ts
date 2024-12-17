import React from "react";
import { isFunction, isNull } from "lodash";
import { GridProps, TableChild } from "@/components/Table/components/grid";
import { TableComponents } from "@/components/Table/types";

export default function useGridFields(props: GridProps): React.ReactElement[] {
  if (isFunction(props.children)) {
    return [];
  }

  return React.Children.toArray(props.children)
    .map((element) => {
      const { type: Component } = findElementByType(element as TableChild, [TableComponents.Field]) || {};

      if (Component?.type === TableComponents.Field) {
        return element as React.ReactElement;
      }
      return null;
    })
    .filter(Boolean);
}

function findElementByType(element: React.ReactElement, types: TableComponents[]) {
  if (isNull(element)) {
    return null;
  }

  const { type: Component } = element as any;

  const componentType = Component?.type;

  if (types.includes(componentType)) {
    return element;
  } else {
    try {
      // Try to instantiate the component with props to receive elements that this component returns
      const instantiatedElement = isReactFragment(element)
        ? element.props.children
        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          Component(element.props);

      const instantiatedElements = Array.isArray(instantiatedElement) ? instantiatedElement : [instantiatedElement];

      return instantiatedElements.find((instantiatedElement) => {
        return types.includes(instantiatedElement.type?.type);
      });
    } catch (error) {
      return element.props.children;
    }
  }
}

function isReactFragment(element: React.ReactElement): boolean {
  return element.type === React.Fragment;
}
