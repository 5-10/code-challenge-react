import React from "react";
import { classNames } from "@/utils";
import If from "@/components/If/If";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export function MobilePaginationLayout(props: React.PropsWithChildren) {
  return <div className="flex flex-1 justify-between sm:hidden">{props.children}</div>;
}

export function MobileGoToPageButton(
  props: React.PropsWithChildren<{
    className?: string;
    isNextPage?: boolean;
    disabled?: boolean;
    onClick: React.MouseEventHandler<HTMLSpanElement>;
  }>,
) {
  const defaultClassName =
    "cursor-pointer relative inline-flex items-center rounded-md border border-textureLightGrayOld bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50";
  return (
    <span
      onClick={props.onClick}
      className={classNames(
        defaultClassName,
        props.isNextPage && "ml-3",
        props.disabled && "invisible",
      )}
    >
      {props.children}
    </span>
  );
}

export function DesktopPaginationLayout(props: React.PropsWithChildren) {
  return <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">{props.children}</div>;
}

export function Page({ children, isCurrent, ...props }: React.PropsWithChildren<{ isCurrent?: boolean }>) {
  const defaultClassName =
    "cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20";

  const isCurrentClassNames =
    "z-10 bg-texturePennBlue text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

  const notCurrentClassNames = "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0";

  return (
    <span
      aria-current="page"
      className={classNames(defaultClassName, isCurrent ? isCurrentClassNames : notCurrentClassNames)}
      {...props}
    >
      {children}
    </span>
  );
}

export function DesktopGoToPageButton({
  isNextPage,
  ...props
}: {
  isNextPage?: boolean;
  onClick: React.MouseEventHandler<HTMLSpanElement>;
}) {
  const className =
    "cursor-pointer relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0";
  return (
    <span className={classNames(className, isNextPage ? "rounded-r-md" : "rounded-l-md")} {...props}>
      <If condition={isNextPage}>
        <If.Then>
          <CaretRight className="h-5 w-5" aria-hidden="true" />
        </If.Then>
        <If.Else>
          <CaretLeft className="h-5 w-5" aria-hidden="true" />
        </If.Else>
      </If>
    </span>
  );
}
