import React from "react";
import usePrevious from "@/hooks/usePrevious";
import { useTableContextFromUrl } from "@/components/Table/hooks/use-table-router-context";
import { AnyObject, isDefined, notEmpty, notEqual } from "@9yco/utils.utils";
import { UseTableInput } from "@/components/Table/hooks/use-table";
import { get, isArray, isEmpty, isFunction, isPlainObject, merge } from "lodash";

export interface UseFilter {
  initialFilter: AnyObject;
  filter: AnyObject;
  setFilter: SetFilter;
  resetFilter(): void;
  applyLocalFilters(data: AnyObject[], filter: AnyObject): AnyObject[];
  filterChangedTimestamp?: string;
}

export type SetFilter = (filter: React.SetStateAction<AnyObject>) => void;

export function useFilter(props: UseTableInput): UseFilter {
  const { initialFilter, filter, filterChangedTimestamp, setFilter, resetFilter } = useFilterState(props);

  return {
    initialFilter,
    filter,
    setFilter,
    resetFilter,
    filterChangedTimestamp,
    applyLocalFilters,
  };
}

function useFilterState(props: UseTableInput) {
  const { input: urlContext } = useTableContextFromUrl(props.name);

  const initialFilter = props.filter || {};

  const defaultFilter = merge(props.withRouter ? urlContext?.filter ?? {} : {}, props.filter);

  const [filter, setFilterToState] = React.useState<AnyObject>(defaultFilter);

  const filterChangedTimestamp = React.useRef<undefined | string>();

  useOnValueChange(props.filter, (filter) => {
    setFilter((previousFilter) => {
      return merge(previousFilter, filter);
    });
  });

  function resetFilter() {
    setFilter(initialFilter);
  }

  function setFilter(filter: React.SetStateAction<AnyObject>): void {
    filterChangedTimestamp.current = new Date().toISOString();

    if (isFunction(filter)) {
      return setFilterToState((currentFilter) => {
        return sanitizeFilter(filter(currentFilter));
      });
    }

    setFilterToState(sanitizeFilter(filter));
  }

  return {
    initialFilter,
    filter,
    setFilter,
    resetFilter,
    filterChangedTimestamp: filterChangedTimestamp.current,
  };
}

function useOnValueChange(value: any, onChange: (value: any) => void) {
  const previousValue = usePrevious(value);
  React.useEffect(() => {
    if (isDefined(previousValue) && notEqual(previousValue, value)) {
      onChange(value);
    }
  }, [previousValue, value]);
}

export function applyLocalFilters(data: AnyObject[], filter: AnyObject): AnyObject[] {
  const sanitizedFilter = sanitizeFilter(filter || {});
  if (notEmpty(sanitizedFilter)) {
    return data.filter((row) => {
      const filterKeys = objectKeysAsArray(sanitizedFilter);

      return filterKeys.every((key) => {
        const value = get(sanitizedFilter, key);

        if (Array.isArray(value) && notEmpty(value)) {
          return value.includes(get(row, key));
        }

        if (isPlainObject(value)) {
          // Check for operators and apply logic
        }

        return get(row, key) === value;
      });
    });
  }

  return data;
}

export function sanitizeFilter(filter: AnyObject): AnyObject {
  return Object.entries(filter).reduce((sanitized, [name, value]) => {
    if (
      [/*null,*/ undefined].includes(value) ||
      // If its an empty array or object we remove it from filters
      ((isArray(value) || isPlainObject(value)) && isEmpty(value))
    ) {
      return sanitized;
    }

    let sanitizedValue = value;

    if (isPlainObject(value)) {
      sanitizedValue = sanitizeFilter(value);
    }

    return { ...sanitized, [name]: sanitizedValue };
  }, {});
}

function objectKeysAsArray(anyObject: AnyObject) {
  const isObject = (value: any) => value && typeof value === "object" && !Array.isArray(value);

  const addDelimiter = (a: string, b: string) => (a ? `${a}.${b}` : b);

  function paths(anyObject: AnyObject = {}, head = ""): string[] {
    return Object.entries<AnyObject>(anyObject).reduce((product, [key, value]) => {
      const fullPath: any = addDelimiter(head, key);

      return isObject(value) ? product.concat(paths(value, fullPath)) : product.concat(fullPath);
    }, []);
  }

  return paths(anyObject);
}
