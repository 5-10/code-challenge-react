import React from "react";
import useFormContext from "@/components/Form/hooks/use-form-context";

function GlobalError(): JSX.Element | null {
  const form = useFormContext();

  if (form.status?.globalError) {
    return <div className="mb-4 mt-4 text-lg text-red-600">{form.status.globalError}</div>;
  }

  return null;
}

export default GlobalError;
