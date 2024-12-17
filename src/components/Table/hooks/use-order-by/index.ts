import { has, merge, omit } from "lodash";
import { UseTableInput } from "@/components/Table/hooks/use-table";
import { useTableContextFromUrl } from "@/components/Table/hooks/use-table-router-context";

export type UseOrderByInput = UseTableInput & {
  backToFirstPage(): void;
};

export enum OrderByMap {
  Asc = "asc",
  Desc = "desc",
}

export type OrderByObject = Record<string, OrderByMap>;

export interface UseOrderBy {
  orderBy: OrderByObject;
  toggleOrderBy(fieldName: string): void;
  setOrderBy(orderBy: OrderByObject): void;
}

export default function useOrderBy(input: UseOrderByInput) {
  const { input: urlContext } = useTableContextFromUrl(input.name);

  const defaultOrderBy = merge(input.withRouter ? urlContext?.orderBy ?? {} : {}, input.orderBy);

  const [orderBy, setOrderBy] = React.useState<OrderByObject>(defaultOrderBy);

  function toggleOrderBy(fieldName: string): void {
    switch (orderBy[fieldName]) {
      case OrderByMap.Desc:
        has(orderBy, fieldName) && setOrderBy((orderBy) => omit(orderBy, fieldName));
        break;
      case OrderByMap.Asc:
        setOrderBy((orderBy) => ({ ...orderBy, [fieldName]: OrderByMap.Desc }));
        break;
      default:
        setOrderBy((orderBy) => ({ ...orderBy, [fieldName]: OrderByMap.Asc }));
        break;
    }

    input.backToFirstPage();
  }

  return { orderBy, toggleOrderBy, setOrderBy };
}
