import React from "react";

export default function usePrevious<T = any>(value: T): T {
  const ref = React.useRef<T>();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
