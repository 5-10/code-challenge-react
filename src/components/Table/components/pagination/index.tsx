import React from "react";
//import PerPageList from '@/components/Table/components/pagination/components/per-page'
import PagesList from "@/components/Table/components/pagination/components/pages-list";
import { Container } from "@/components/Table/components/pagination/style";
import { TableComponents } from "@/components/Table/types";

export interface PaginationProps {
  size?: string;
}

const defaultProps = {
  size: "large",
};

function Pagination(props: any & PaginationProps) {
  const { count } = props;

  if (count) {
    return (
      <Container data-type="pagination">
        {/*<PerPageList {...props} />*/}
        <PagesList {...props} />
      </Container>
    );
  }

  return null;
}

Pagination.defaultProps = defaultProps;

Pagination.type = TableComponents.Pagination;

export default Pagination;
