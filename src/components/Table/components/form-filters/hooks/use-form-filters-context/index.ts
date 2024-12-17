import { AnyObject, notEmpty } from "@9yco/utils.utils";
import useTableContext from "@/components/Table/hooks/use-table-context";
import useFormContext from "@/components/Form/hooks/use-form-context";
import { has, omit } from "lodash";

export function useFormFiltersContext() {
  const formContext = useFormContext();

  const filtersMeta = useFilterMeta();

  const { setFilter, filter, resetFilter } = useTableContext();

  function applyFilters() {
    formContext.handleSubmit();
  }

  function resetFilters() {
    formContext.resetForm();
    resetFilter();
  }

  function removeFilterByKey(key: string) {
    setFilter((filter) => {
      return omit(filter, key);
    });
  }

  function initialValues(): AnyObject {
    return {
      ...formContext.initialValues,
      ...filter,
    };
  }

  return {
    ...filtersMeta,
    values: formContext.values,
    resetFilters,
    removeFilterByKey,
    applyFilters,
    initialValues: initialValues(),
  };
}

function useFilterMeta() {
  const tableContext = useTableContext();

  const shouldBuildFiltersFromServer = notEmpty(tableContext.paginationMeta?.filters?.default);

  function buildAvailableFormFields<FormFields extends Record<string, string>>(
    formFields: Record<string, string>,
  ): FormFields {
    const meta = tableContext?.paginationMeta;

    const shouldBuildFiltersFromServer = notEmpty(meta?.filters?.default);

    if (shouldBuildFiltersFromServer) {
      const availableFilters = meta?.filters?.default.filter((filter) => has(formFields, filter.field));

      // Create an object map where formFields are the keys and the values are availableFilters field prop
      return Object.fromEntries(
        Object.entries(formFields)
          .map(([key, value]) => {
            const filterFromServer = availableFilters.find((filter) => filter.field === value);

            if (filterFromServer) {
              return [key, filterFromServer.field];
            }
          })
          .filter(Boolean),
      );
    }

    return formFields as FormFields;
  }

  function getFilterField(field: string) {
    return tableContext?.paginationMeta?.filters?.default?.find((filter) => filter.field === field);
  }

  function getFilterFieldOptions(field: string) {
    const filterField = getFilterField(field);

    return filterField?.options ?? [];
  }

  function getFilterFieldOptionsValues(field: string) {
    return getFilterFieldOptions(field).map((data) => data.value);
  }

  function getFilterFieldOptionsCount(field: string) {
    return getFilterFieldOptions(field).reduce((totalCount, data) => {
      return totalCount + data.count;
    }, 0);
  }

  function getFormFieldOptionCount(field: string, option: any) {
    option = parseOption(option);
    return (
      tableContext?.paginationMeta?.filters?.default
        ?.find((filter) => filter.field === field)
        ?.options.find((data) => data.value === option)?.count ?? 0
    );
  }

  function getCurrentFormFieldOptionCount(field: string, option: any) {
    option = parseOption(option);
    if (notEmpty(tableContext?.paginationMeta?.filters?.current)) {
      return (
        tableContext?.paginationMeta?.filters?.current
          ?.find((filter) => filter.field === field)
          ?.options.find((data) => data.value === option)?.count ?? 0
      );
    }

    return undefined;
  }

  function getDefaultFormFieldOptionCount(field: string, option: any) {
    option = parseOption(option);
    if (notEmpty(tableContext?.paginationMeta?.filters?.default)) {
      return (
        tableContext?.paginationMeta?.filters?.default
          ?.find((filter) => filter.field === field)
          ?.options.find((data) => data.value === option)?.count ?? 0
      );
    }

    return undefined;
  }

  function getCurrentFormFieldOptionsCount(field: string) {
    return tableContext?.paginationMeta?.filters?.current
      ?.find((filter) => filter.field === field)
      ?.options.reduce((totalCount, data) => totalCount + data.count, 0);
  }

  function getDefaultFormFieldOptionsCount(field: string) {
    return tableContext?.paginationMeta?.filters?.default
      ?.find((filter) => filter.field === field)
      ?.options.reduce((totalCount, data) => totalCount + data.count, 0);
  }

  function buildAvailableFilters(formFields: Record<string, string>) {
    return tableContext?.paginationMeta?.filters?.default?.filter((filter) => has(formFields, filter.field));
  }

  // This does not work if we are filtering by OR condition because we don't know the context of the filter and how they affect each other.
  // Example: user selects device type battery and manufacturer Tesla. Tesla can have multiple device types, so we can't just add the counts of all device types for Tesla.
  // We would have to do this: total battery devices + total Tesla devices - total battery Tesla devices
  function getTotalCountForAppliedFilters(values: Record<string, any>) {
    if (shouldBuildFiltersFromServer) {
      const appliedFiltersCount = Object.entries(values).reduce((totalCount, [field, value]) => {
        if (Array.isArray(value)) {
          return value.reduce((count, value) => count + getFormFieldOptionCount(field, value), totalCount);
        }

        return totalCount + getFormFieldOptionCount(field, values);
      }, 0);

      return appliedFiltersCount || tableContext?.paginationMeta?.totalCount;
    }

    return undefined;
  }

  function parseOption(value: any) {
    if ([true, false].includes(value)) {
      return value ? "1" : "0";
    }
    return value;
  }

  return {
    buildAvailableFormFields,
    getFilterField,
    getFilterFieldOptions,
    getFilterFieldOptionsValues,
    getFilterFieldOptionsCount,
    getFormFieldOptionCount,
    buildAvailableFilters,
    getTotalCountForAppliedFilters,
    getCurrentFormFieldOptionCount,
    getDefaultFormFieldOptionCount,
    getCurrentFormFieldOptionsCount,
    getDefaultFormFieldOptionsCount,
    shouldBuildFiltersFromServer,
  };
}
