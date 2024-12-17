import React from "react";

export type ForwardRefProps<T> = {
  forwardedRef?: React.Ref<T>;
};

/*
 * The purpose of this HOC is to enforce consistent prop naming when forwarding refs
 */
export default function withForwardRef<Ref, Props>(Component: React.ComponentType<Props>) {
  return React.forwardRef<Ref, Props>((props, ref) => {
    let { forwardedRef } = props as Props & ForwardRefProps<Ref>;

    forwardedRef = forwardedRef || ref;

    const componentProperties = {
      ...props,
      ...(forwardedRef && { forwardedRef }),
    };

    return <Component {...componentProperties} />;
  });
}
