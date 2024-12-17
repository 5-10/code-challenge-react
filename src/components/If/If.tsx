import React from "react";

import { isEmpty } from "lodash";

interface IfProps {
  condition: any;
  children: IfChild | IfChild[];
}

type IfChild = (JSX.Element & { type: { type: Type } }) | (JSX.Element & { type: { type: Type } }[]) | undefined;

enum Type {
  Then = "THEN",
  Else = "ELSE",
}

export function If({ children, condition }: IfProps): any {
  if (React.Children.count(children) === 1) {
    return condition ? children : null;
  }

  const elements = React.Children.map(children, (element) => {
    const Component = element?.type;

    if (condition) {
      if (Component?.type === Type.Then) {
        return element;
      }
    } else if (Component?.type === Type.Else) {
      return element;
    }

    return null;
  });

  if (isEmpty(elements) === false) {
    return elements;
  }

  return condition ? children : null;
}

interface ThenProps {
  children: IfChild | any;
}

export function Then({ children }: ThenProps) {
  return children;
}

Then.type = Type.Then;

interface ElseProps {
  children: IfChild | any;
}

export function Else({ children }: ElseProps) {
  return children;
}

Else.type = Type.Else;

If.Then = Then;
If.Else = Else;

export default If;
