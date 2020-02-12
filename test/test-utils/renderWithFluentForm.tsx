import React from "react";

import { render } from "@testing-library/react";

import { useFluentForm } from "../../src";
import { FormConfig } from "../../src/form-config/FormConfig";
import { FluentFormRef, UiComponentProps } from "../types";

export function renderWithFluentForm<C extends FormConfig>(
  config: C,
  UiComponent: React.FC<UiComponentProps<C>>
) {
  const fluentFormRef: FluentFormRef<C> = {
    current: null as any
  };

  const Wrapper = () => {
    const fluentForm = useFluentForm<C>(config);
    fluentFormRef.current = fluentForm;

    return <UiComponent fluentForm={fluentForm} />;
  };

  return { ...render(<Wrapper />), fluentFormRef };
}
