import { FormConfig } from "../src/form-config/FormConfig";
import { FluentFormReturnType } from "../src/types";

// renderWithFluentForm

export type UiComponentProps<C extends FormConfig> = {
  fluentForm: FluentFormReturnType<C>;
};

export type FluentFormRef<C extends FormConfig> = {
  current: FluentFormReturnType<C>;
};
