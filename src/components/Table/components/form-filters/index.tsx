import React from "react";
import Form, { FormContext } from "@/components/Form";
import { Footer, Container } from "@/components/Table/components/form-filters/style";
import { ZodObject } from "zod";
import { TableComponents } from "@/components/Table/types";
import { useFormFilters } from "./hooks/use-form-filters";
import { AnyObject } from "@9yco/utils.utils";
import { SetFilter } from "../../hooks/use-filter";
import { UseSearch } from "../../hooks/use-search";
import { isFunction, noop } from "lodash";

export interface FormFiltersContext<FormValues = AnyObject> {
  form: FormContext<FormValues>;
  applyFilters(): void;
  resetFilters(): void;
  removeFilterByKey(key: string): void;
}

export interface FormFilterProps {
  children: ((context: FormFiltersContext) => React.ReactNode) | React.ReactNode;
  validationSchema?: ZodObject<any>;
  initialValues?: AnyObject;
  display?: "row" | "column";
}

const defaultProps = {
  validationSchema: undefined,
  initialValues: {},
  display: "column",
  filter: {},
  setFilter: noop,
};

export interface RequiredFormFilterProps {
  setFilter: SetFilter;
  filter: AnyObject;
  setSearch: UseSearch["setSearch"];
  search: UseSearch["search"];
}

function FormFilters(props: FormFilterProps) {
  const { initialValues, onSubmit, resetFilters, removeFilterByKey, applyFilters } = useFormFilters(props);

  return (
    <Form
      enableReinitialize
      initialValues={initialValues}
      validationSchema={props.validationSchema}
      onSubmit={onSubmit}
    >
      {(form) => {
        const children = isFunction(props.children)
          ? props.children({
              form,
              applyFilters,
              resetFilters,
              removeFilterByKey,
            })
          : props.children;

        return (
          <Container display={props.display} data-type="table-filters">
            {children}
          </Container>
        );
      }}
    </Form>
  );
}

FormFilters.defaultProps = defaultProps;

FormFilters.type = TableComponents.Filters;

FormFilters.Footer = Footer;

export default FormFilters;
