import { ValidationTrigger } from "../constants/validationTrigger";
import {
  ExtractErrorsType,
  ExtractFieldsType,
  ExtractValuesType,
  MappedFields
} from "../types";
import { FormConfig } from "./FormConfig";

export class FormConfigHelper<Config extends FormConfig = any> {
  protected formConfig: Config;

  constructor(formConfig: Config) {
    this.formConfig = formConfig;
  }

  public getInitialValues(): ExtractValuesType<Config> {
    const valuesFromFields = this.getInitialValuesFromFields();
    return { ...valuesFromFields, ...this.formConfig._initialValues };
  }

  public getValidationResultForAllFields(
    values: ExtractValuesType<Config>,
    context: any
  ): ExtractErrorsType<Config> {
    if (this.formConfig._validator) {
      return this.formConfig._validator.validateAllFields(values, context);
    } else {
      return {} as ExtractErrorsType<Config>;
    }
  }

  public getValidationResultForField<K extends keyof ExtractValuesType<Config>>(
    field: K,
    value: ExtractValuesType<Config>[K],
    values: ExtractValuesType<Config>,
    context: any
  ): ExtractErrorsType<Config>[K] {
    if (this.formConfig._validator) {
      const error = this.formConfig._validator.validateField(
        field,
        {
          ...values,
          [field]: value
        },
        context
      );

      return error;
    } else {
      return undefined;
    }
  }

  public getMappedFields(
    values: ExtractValuesType<Config>,
    onTouch: <K extends keyof ExtractValuesType<Config>>(
      field: K,
      value: boolean
    ) => void,
    onChange: <K extends keyof ExtractValuesType<Config>>(
      field: K,
      value: ExtractValuesType<Config>[K]
    ) => void
  ) {
    type Fields = ExtractFieldsType<Config>;
    type Values = ExtractValuesType<Config>;

    const fields = this.formConfig._fields;

    return (Object.keys(fields) as Array<keyof Fields>).reduce(
      <K extends keyof Fields>(
        mappedObj: MappedFields<Fields>,
        key: K
      ): MappedFields<Fields> => {
        const setValueForField = (value: Values[K]) => {
          onChange(key, value);
        };

        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        const setTouchedForField = (value: boolean = true) => {
          onTouch(key, value);
        };
        return {
          ...mappedObj,
          [key]: this.formConfig._fields[key].mapToComponentProps({
            value: values[key],
            setValue: setValueForField,
            setTouched: setTouchedForField
          })
        };
      },
      {} as MappedFields<Fields>
    );
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
