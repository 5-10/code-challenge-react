import React from "react";
import {
  Page,
  MobilePaginationLayout,
  MobileGoToPageButton,
  DesktopPaginationLayout,
  DesktopGoToPageButton,
} from "@/components/Table/components/pagination/components/pages-list/style";
import { range } from "lodash";
import { PaginationProps } from "@/components/Table/hooks/use-pagination";
import { Trans } from "react-i18next";

interface Props extends PaginationProps {
  size: string;
}

const defaultProps = {
  totalPages: 0,
  page: 1,
  count: 0,
  size: "large",
};

function PagesList(props: Props) {
  function pageChanged(page: number) {
    return function () {
      props.setPage(page);
    };
  }

  function renderPages() {
    const { totalPages, size } = props;

    const currentPage = props.page;

    const showPages = size === "large" ? 9 : 7;

    const padding = size === "large" ? 2 : 1;

    let pages: any[] = [];

    if (totalPages <= showPages) {
      pages = totalPages > 1 ? range(1, totalPages + 1) : [1];
    } else {
      const showHighDots = currentPage + (padding + 2) < totalPages;
      const showLowDots = currentPage - padding > 3;

      if (showLowDots && showHighDots) {
        pages = [1, null];
        let index = currentPage - padding;

        for (index; index <= currentPage + padding; index++) {
          pages.push(index);
        }

        pages = [...pages, null, totalPages];
      } else if (showLowDots) {
        pages = [1, null, ...range(totalPages - showPages + 3, totalPages + 1)];
      } else if (showHighDots) {
        pages = [...range(1, showPages - 1), null, totalPages];
      }
    }

    return pages.map((page) => {
      const hasPage = page !== null;

      const rest = {
        ...(hasPage ? { onClick: pageChanged(page) } : {}),
      };

      const isCurrentPage = props.page === page;

      return (
        <Page key={page} isCurrent={isCurrentPage} data-type={`page-${page}`} {...rest}>
          {page || "..."}
        </Page>
      );
    });
  }

  const { count, totalCount, hasNextPage, hasPreviousPage, totalPages, page, perPage } = props;

  if (totalPages > 1) {
    return (
      <>
        <MobilePaginationLayout>
          <MobileGoToPageButton onClick={props.previousPage} disabled={!hasPreviousPage}>
            Previous
          </MobileGoToPageButton>
          <MobileGoToPageButton onClick={props.nextPage} isNextPage disabled={!hasNextPage}>
            Next
          </MobileGoToPageButton>
        </MobilePaginationLayout>
        <DesktopPaginationLayout>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              {hasPreviousPage && <DesktopGoToPageButton onClick={props.previousPage} />}
              {props.isCursorPagination() === false && renderPages()}
              {hasNextPage && <DesktopGoToPageButton onClick={props.nextPage} isNextPage />}
            </nav>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <Trans
                i18nKey="common.showingToOfResults"
                components={{ span: <span className="font-medium" /> }}
                values={{
                  from: page === 1 ? page : (page - 1) * perPage + 1,
                  to: perPage * page > totalCount ? totalCount : perPage * page,
                  total: totalCount,
                }}
              />
            </p>
          </div>
        </DesktopPaginationLayout>
      </>
    );
  }

  return null;
}

PagesList.defaultProps = defaultProps;

export default PagesList;
