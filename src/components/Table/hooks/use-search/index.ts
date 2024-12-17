import { TableProps } from "@/components/Table";
import { isDefined } from "@9yco/utils.utils";

export interface UseSearch {
  search: SearchInput;
  setSearch(search: Partial<SearchInput>): void;
  isSearchSet(): boolean;
}

export enum SearchType {
  fullText = "fullText",
  partial = "partial",
}

interface SearchInput {
  query: string;
  fields: string[];
  type?: SearchType;
}
export default function useSearch(props: TableProps): UseSearch {
  const [searchFields, setSearchFields] = React.useState([]);

  const [query, setQuery] = React.useState<string | undefined>(undefined);

  const [searchType, setSearchType] = React.useState<SearchType>();

  function setSearch(search: Partial<SearchInput>) {
    setQuery(search.query);
    isDefined(search.fields) && setSearchFields(search.fields);
    isDefined(search.type) && setSearchType(search.type);
  }

  function isSearchSet() {
    return isDefined(query) && searchFields.length > 0;
  }

  return {
    search: {
      query,
      fields: searchFields,
      type: searchType,
    },
    isSearchSet,
    setSearch,
  };
}
