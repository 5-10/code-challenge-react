import React from "react";
import If from "@/components/If/If";
import SortIcon from "@/components/Table/components/column-header/components/sort-icon";
import { SortableContainer, StyledHeader } from "./style";
import type { UseSort } from "@/components/Table/hooks/use-sort";
import type { FieldProps } from "@/components/Table/components/fields/field";

interface ColumnHeaderProps extends UseSort {
  columnNumber: number;
  isHidden?: boolean;
  align?: FieldProps["align"];
  sortKey?: FieldProps["sortKey"];
  sortable?: FieldProps["sortable"];
  label: FieldProps["label"];
  name: FieldProps["name"];
}

const defaultProps: Partial<ColumnHeaderProps> = {
  sortable: false,
};

export default function ColumnHeader(props: ColumnHeaderProps) {
  const { columnNumber, isHidden, label, getSortValue } = props;

  const sortKey = (props.sortKey ?? props.name) as string;

  const isSortable = Boolean(sortKey) && props.sortable;

  function toggleSorter() {
    props.toggleSort(sortKey);
  }

  if (props.isHidden) {
    return null;
  }

  return (
    <StyledHeader
      data-column-number={columnNumber}
      data-type="column-header"
      data-name={props.name}
      data-sort-by={sortKey}
      data-sort-direction={getSortValue(sortKey)}
      data-sortable={String(Boolean(sortKey))}
      align={props.align}
      isHidden={isHidden}
      isSortable={isSortable}
    >
      <If condition={isSortable}>
        <If.Then>
          <SortableContainer onClick={toggleSorter}>
            {label}
            <SortIcon isAscending={props.isAscending(sortKey)} isDescending={props.isDescending(sortKey)} />
          </SortableContainer>
        </If.Then>
        <If.Else>{label}</If.Else>
      </If>
    </StyledHeader>
  );
}

ColumnHeader.defaultProps = defaultProps;
