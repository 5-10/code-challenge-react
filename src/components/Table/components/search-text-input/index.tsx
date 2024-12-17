import React from "react";
import Form from "@/components/Form";
import TextInput, { TextInputProps } from "@/components/TextInput";
import useTableContext from "@/components/Table/hooks/use-table-context";
import { useTableContextFromUrl } from "@/components/Table/hooks/use-table-router-context";
import { isDefined, notEmpty, notEqual } from "@9yco/utils.utils";
import { XCircle } from "@phosphor-icons/react";
import { SearchType } from "@/components/Table/hooks/use-search";

interface Props extends Omit<TextInputProps, "forwardedRef" | "ref"> {
  searchFields: string[];
  searchType: "fullText" | "partial";
}

export default function SearchTextInput(props: Props) {
  const table = useTableContext();

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const { input } = useTableContextFromUrl(table.name);

  const { setSearch, search } = table || {};

  React.useEffect(() => {
    if (notEmpty(props.searchFields)) {
      if (notEmpty(search?.fields)) {
        if (notEqual(props.searchFields, search?.fields)) {
          throw new Error("You can only define search fields either on SearchTextInput or Table component");
        }
      } else {
        setSearch({ fields: props.searchFields });
      }
    }
  }, []);

  React.useEffect(() => {
    searchInputRef.current.value = input?.search?.query ?? "";
  }, [input?.search?.query]);

  function resetSearchQuery() {
    setSearch({ query: undefined });
  }

  function applySearchQuery(query: string) {
    if (isDefined(props.searchFields)) {
      setSearch({ query, fields: props.searchFields, type: props.searchType as SearchType });
    } else {
      setSearch({ query });
    }
  }

  return (
    <TextInput
      {...props}
      ref={searchInputRef}
      iconLeft={(value) => {
        if (value) {
          return (
            <XCircle
              className="ml-2 h-4 w-4 cursor-pointer"
              onClick={() => {
                resetSearchQuery();
                searchInputRef.current.value = "";
              }}
            />
          );
        }
        return null;
      }}
      iconRight={() => (
        <Form.Button
          label="Search"
          onClick={() => {
            if (searchInputRef.current.value) {
              applySearchQuery(searchInputRef.current.value);
            } else {
              resetSearchQuery();
            }
          }}
        />
      )}
    />
  );
}
