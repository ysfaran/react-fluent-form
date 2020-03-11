import { useCallback } from "react";

import { FormArrayConfig } from "../../form-config/FormArrayConfig";
import { UseFluentFormItem, UseFluentFormItemArgs } from "../../types";
import { useFluentFormBase } from "../fluent-form/useFluentFormBase";
import { useStateManagerMapper } from "../helper/useStateManagerMapper";

export function useFluentFormItem<Config extends FormArrayConfig>(
  args: UseFluentFormItemArgs<Config>
): UseFluentFormItem<Config> {
  const { stateManager, key, config } = args;
  const { removeForm } = stateManager;

  const fluentStateManager = useStateManagerMapper(key, stateManager);
  const fluentFormBase = useFluentFormBase(config, fluentStateManager);

  const removeSelf = useCallback(() => {
    removeForm(key);
  }, [key, removeForm]);

  return { ...fluentFormBase, key, removeSelf };
}
