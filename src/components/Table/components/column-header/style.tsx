import { classNames } from "@/utils";
import { AlignMap } from "@/components/Table/types";

import { Text } from "@/components/Typography";

export function SortableContainer(
  props: React.PropsWithChildren<{
    onClick: React.MouseEventHandler<HTMLDivElement>;
  }>,
) {
  return (
    <div className="flex items-center" onClick={props.onClick}>
      {props.children}
    </div>
  );
}

export function StyledHeader(
  props: React.PropsWithChildren<{ isHidden?: boolean; isSortable: boolean; upperCase?: boolean; align?: AlignMap }>,
) {
  const { children, isHidden, isSortable, upperCase, align = AlignMap.Left, ...rest } = props;

  return (
    <th
      scope="col"
      className={classNames(
        "px-4 pb-1.5 pt-1.5 text-left gap-1 bg-white",
        isSortable && "cursor-pointer",
        isHidden && "hidden",
        upperCase && "uppercase",
        align === AlignMap.Left && "text-left",
        align === AlignMap.Center && "text-center",
        align === AlignMap.Right && "text-right",
      )}
      {...rest}
    >
      <div className={classNames("group inline-flex", isSortable ? "cursor-pointer" : "")}>
        <Text.Gray extraSmall ellipsis>
          {children}
        </Text.Gray>
      </div>
    </th>
  );
}
