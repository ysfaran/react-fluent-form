import { ExtractErrorsType, ExtractValuesType, FormArrayState } from "../types";
import { FormArrayConfig } from "./FormArrayConfig";
import { FormConfigHelper } from "./FormConfigHelper";

export class FormArrayConfigHelper<Config extends FormArrayConfig = any> {
  private formArrayConfig: Config;
  private formConfigHelper: FormConfigHelper<Config>;

  constructor(formArrayConfig: Config) {
    this.formArrayConfig = formArrayConfig;
    this.formConfigHelper = new FormConfigHelper(formArrayConfig);
  }

  public getInitialArrayValues = (
    initialArray: ExtractValuesType<Config>[] = this.formArrayConfig
      ._initialArray
  ): FormArrayState<ExtractValuesType<Config>, ExtractErrorsType<Config>> => {
    type Errors = ExtractErrorsType<Config>;

    const { _generateKey } = this.formArrayConfig;

    const formArray: FormArrayState<ExtractValuesType<Config>, Errors> = {};

    for (let i = 0; i < initialArray.length; i++) {
      const item = initialArray[i];
      const key = (_generateKey && _generateKey(item)) || i;
      formArray[key] = {
        key: key,
        sortPosition: i,
        ...this.formConfigHelper.getInitialState(item),
      };
    }

    return formArray;
  };
}
