import { ExtractErrorsType, ExtractValuesType, FormArrayState } from "../types";
import { FormArrayConfig } from "./FormArrayConfig";

export class FormArrayConfigHelper<Config extends FormArrayConfig = any> {
  private formArrayConfig: Config;

  constructor(formArrayConfig: Config) {
    this.formArrayConfig = formArrayConfig;
  }

  public getInitialArrayValues(): FormArrayState<
    ExtractValuesType<Config>,
    ExtractErrorsType<Config>
  > {
    type Errors = ExtractErrorsType<Config>;

    const { _generateKey, _initialArray } = this.formArrayConfig;

    const formArray: FormArrayState<ExtractValuesType<Config>, Errors> = {};

    for (let i = 0; i < _initialArray.length; i++) {
      const item = _initialArray[i];
      const key = (_generateKey && _generateKey(item)) || i;
      formArray[key] = {
        key: key,
        sortPosition: i,
        values: item,
        touched: {},
        validity: {},
        errors: {} as Errors,
        context: undefined,
        submitting: false
      };
    }

    return formArray;
  }
}
