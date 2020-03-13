import { FormArrayConfig } from "../../form-config/FormArrayConfig";
import { UseFluentFormArray } from "../../types";
import { useFluentArrayStateManager } from "./state-manager/useFluentArrayStateManager";
import { useFluentFormArrayBase } from "./useFluentFormArrayBase";

export function useFluentFormArray<Config extends FormArrayConfig>(
  config: Config
): UseFluentFormArray<Config> {
  const stateManager = useFluentArrayStateManager<Config>(config);

  return useFluentFormArrayBase(config, stateManager);
}
