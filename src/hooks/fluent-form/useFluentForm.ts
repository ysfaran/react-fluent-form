import { FormConfig } from "../../form-config/FormConfig";
import { UseFluentForm } from "../../types";
import { useFluentStateManager } from "./state-manager/useFluentStateManager";
import { useFluentFormBase } from "./useFluentFormBase";

export function useFluentForm<Config extends FormConfig>(
  config: Config
): UseFluentForm<Config> {
  const stateManager = useFluentStateManager(config);

  return useFluentFormBase(config, stateManager);
}
