import { ValidationTrigger } from "../constants/validationTrigger";
import { ExtractValuesType } from "../types";
import { FormConfig } from "./FormConfig";

export class FormConfigHelper<Config extends FormConfig = any> {
  private formConfig: Config;

  constructor(formConfig: Config) {
    this.formConfig = formConfig;
  }

  public getInitialValues(): ExtractValuesType<Config> {
    const valuesFromFields = this.getInitialValuesFromFields();
    return { ...valuesFromFields, ...this.formConfig._initialValues };
  }

  public shouldValidateOnChange<K extends keyof ExtractValuesType<Config>>(
    field: K,
    touched?: boolean
  ) {
    const toConsiderTrigger = this.getToConsiderTrigger(field);

    return (
      toConsiderTrigger === ValidationTrigger.OnChange ||
      (toConsiderTrigger === ValidationTrigger.AfterTouchOnChange && !!touched)
    );
  }

  public shouldValidateOnBlur<K extends keyof ExtractValuesType<Config>>(
    field: K,
    touchedNow: boolean
  ) {
    const toConsiderTrigger = this.getToConsiderTrigger(field);

    return (
      toConsiderTrigger === ValidationTrigger.AfterTouchOnChange && touchedNow
    );
  }

  private getToConsiderTrigger<K extends keyof ExtractValuesType<Config>>(
    field: K
  ) {
    const fieldTrigger = this.getFieldTrigger(field);
    const globalTrigger = this.formConfig._validationTrigger;

    return fieldTrigger || globalTrigger;
  }

  private getFieldTrigger<K extends keyof ExtractValuesType<Config>>(field: K) {
    return this.formConfig._fields[field].validationTrigger;
  }

  private getInitialValuesFromFields(): ExtractValuesType<Config> {
    const keys = Object.keys(this.formConfig._fields) as Array<
      keyof ExtractValuesType<Config>
    >;

    return keys.reduce((initialValues, key) => {
      return {
        ...initialValues,
        [key]: this.formConfig._fields[key]._initialValue
      };
    }, {} as ExtractValuesType<Config>);
  }
}
