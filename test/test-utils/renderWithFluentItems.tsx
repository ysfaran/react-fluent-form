import React from "react";

import { render } from "@testing-library/react";

import { useFluentFormArray, useFluentFormItem } from "../../src";
import { FormArrayConfig } from "../../src/form-config/FormArrayConfig";
import { FormConfig } from "../../src/form-config/FormConfig";
import {
  FluentFormArrayRef,
  FluentFormItemsRef,
  FormItemsRefSetterProps,
  UiItemComponentProps
} from "../types";

function FormItemsInitializer<C extends FormArrayConfig>({
  formItemArgs,
  formItemsRef,
  Component
}: FormItemsRefSetterProps<C>) {
  const formItem = useFluentFormItem(formItemArgs);
  formItemsRef.current[formItemArgs.key] = formItem;

  return <Component formItem={formItem} />;
}

export function renderWithFluentFormItems<C extends FormArrayConfig>(
  config: C,
  UiItemComponent: React.FC<UiItemComponentProps<C>>
) {
  const fluentFormArrayRef: FluentFormArrayRef<C> = {
    current: null as any
  };

  const fluentFormItemsRef: FluentFormItemsRef<C> = {
    current: {} as any
  };

  const Wrapper = () => {
    const fluentFormArray = useFluentFormArray<C>(config);
    fluentFormArrayRef.current = fluentFormArray;

    return (
      <>
        {fluentFormArray.formArray.map(formItem => {
          return (
            <FormItemsInitializer
              key={formItem.key}
              formItemArgs={formItem}
              formItemsRef={fluentFormItemsRef}
              Component={UiItemComponent}
            />
          );
        })}
      </>
    );
  };

  return { ...render(<Wrapper />), fluentFormArrayRef, fluentFormItemsRef };
}
