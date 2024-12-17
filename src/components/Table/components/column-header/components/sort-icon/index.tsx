import React from "react";
import If from "@/components/If/If";
import { ArrowDown, ArrowUp } from "@phosphor-icons/react";
import { classNames } from "@/utils";

interface Props {
  isAscending: boolean;
  isDescending: boolean;
}

function SortIcon({ isAscending, isDescending }: Props) {
  const isVisible = isAscending || isDescending;

  return (
    <>
      <span
        data-type="sort-icon"
        className={classNames(
          "ml-2 flex-none rounded text-textureInputCount",
          !isVisible && "invisible group-hover:visible group-focus:visible",
        )}
      >
        <If condition={isVisible}>
          <If.Then>
            <If condition={isAscending}>
              <ArrowDown className="h-3 w-3" aria-hidden="true" />
            </If>
            <If condition={isDescending}>
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
            </If>
          </If.Then>
          <If.Else>
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
          </If.Else>
        </If>
      </span>
    </>
  );
}

export default SortIcon;
