import React from "react";
import useTableContext from "@/components/Table/hooks/use-table-context";
import { useFormFiltersContext } from "@/components/Table/components/form-filters/hooks/use-form-filters-context";
import { AnyObject, notEmpty } from "@9yco/utils.utils";
import { FormFilterProps, RequiredFormFilterProps } from "@/components/Table/components/form-filters";
import { omit } from "lodash";

export function useFormFilters(props: FormFilterProps) {
  const { applyFilters, resetFilters, removeFilterByKey, initialValues } = useFormFiltersContext();

  const { setFilter } = useTableContext();

  React.useEffect(() => {
    if (notEmpty(props.initialValues)) {
      setFilter && setFilter((filter) => ({ ...filter, ...props.initialValues }));
    }
  }, [props.initialValues]);

  function onSubmit(values: AnyObject) {
    const newFilter = omit(values, ["__formReset"]);

    setFilter && setFilter(newFilter);
  }

  return {
    resetFilters,
    removeFilterByKey,
    initialValues,
    applyFilters,
    onSubmit,
  };
}
