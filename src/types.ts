import React, { Reducer } from "react";
import * as yup from "yup";

import { ValidationTrigger } from "./constants/validationTrigger";
import { Field } from "./fields/Field";
import { FormConfig } from "./form-config/FormConfig";
import { FluentFormActionTypes } from "./reducer";

// FluentForm: state

export type StateValidity<ValuesType> = {
  readonly [K in keyof ValuesType]?: boolean;
};
export type StateTouched<ValuesType> = {
  readonly [K in keyof ValuesType]?: boolean;
};
export type ErrorsType<ValuesType extends object, Error = any> = {
  [K in keyof ValuesType]?: Error;
};

export interface FluentFormState<
  ValuesType extends object,
  Errors extends ErrorsType<ValuesType>
> {
  values: ValuesType;
  touched: StateTouched<ValuesType>;
  validity: StateValidity<ValuesType>;
  errors: Errors;
  context: any;
  submitting: boolean;
}

// FluentForm: reducer

export type FluentFormReducer<
  ValuesType extends object,
  Errors extends ErrorsType<ValuesType>
> = Reducer<
  FluentFormState<ValuesType, Errors>,
  FluentFormActionTypes<ValuesType, keyof ValuesType, Errors>
>;

export type Action<K, Payload = void> = Payload extends void
  ? { type: K }
  : { type: K; payload: Payload };

// FluentForm: state setters

export type SetValue<V> = (value: V) => void;
export type SetValidity = (value?: boolean) => void;
export type SetTouched = (value?: boolean) => void;
export type SetError<E> = (value: E) => void;

// FluentForm: misc

export type HandleSubmitOptions = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

export type FluentFormReturnType<Config extends FormConfig> = {
  values: ExtractValuesType<Config>;
  touched: StateTouched<ExtractValuesType<Config>>;
  validity: StateValidity<ExtractValuesType<Config>>;
  errors: ExtractErrorsType<Config>;
  context: any;
  submitting: boolean;
  fields: MappedFields<ExtractFieldsType<Config>>;
  setValues: (values: Partial<ExtractValuesType<Config>>) => void;
  setInitialValues: (values: ExtractValuesType<Config>) => void;
  setContext: (context: any) => void;
  handleSubmit: (
    success?: Function,
    failure?: Function,
    options?: HandleSubmitOptions
  ) => (e?: any) => void;
  reset: () => void;
};

// FormConfig

export type ShouldValidateOneChangeArgs = {
  globalTrigger: ValidationTrigger;
  fieldTrigger: ValidationTrigger | undefined;
  touched: boolean | undefined;
};

export type ShouldValidateOnBlurArgs = {
  globalTrigger: ValidationTrigger;
  fieldTrigger: ValidationTrigger | undefined;
  touchedNow: boolean | undefined;
};

export type ExtractFieldsType<
  Config extends FormConfig
> = Config extends FormConfig<any, infer FieldsType> ? FieldsType : never;

export type ExtractValuesType<
  Config extends FormConfig
> = Config extends FormConfig<infer ValuesType> ? ValuesType : never;

export type ExtractErrorsType<
  Config extends FormConfig
> = Config extends FormConfig<any, any, infer Error> ? Error : never;

// Fields

export type Fields<ValuesType extends object = any> = {
  [K in keyof ValuesType]: Field<ValuesType[K]>;
};

export type ComponentPropsMapperArgs<V> = {
  value: V;
  setValue: SetValue<V>;
  setTouched: SetTouched;
};

export type ComponentPropsMapper<V, Props> = (
  args: ComponentPropsMapperArgs<V>
) => Props;

export type MappedFields<F extends Fields> = {
  [K in keyof F]: ReturnType<F[K]["mapToComponentProps"]>;
};

// Fields: input

export type CheckboxInputType = "checkbox";
export type RadioInputType = "radio";
export type ValueInputTypes =
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "image"
  | "month"
  | "number"
  | "password"
  | "range"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

export type Input = CheckboxInputType | RadioInputType | ValueInputTypes;

export type InputValue = string | string[] | number | undefined;

export interface InputProps {
  type?: Input;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e?: React.FocusEvent<HTMLInputElement>) => void;
}

export interface InputPropsValue extends InputProps {
  value: InputValue;
}

export interface InputPropsChecked extends InputProps {
  checked: boolean;
}

export interface InputPropsRadio extends InputPropsChecked {
  checked: boolean;
  name?: string;
}

export type InputPropsRadioGenerator = (radioValue: string) => InputPropsRadio;

// Fields: textarea

export interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

// Fields: select

export interface SelectProps {
  select: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  };
  option: (value: string) => { value: string };
}

// Fields: raw

export interface RawProps<V> {
  value: V;
  onChange: (value: V) => void;
  onBlur: () => void;
}

// Validation: DefaultValidator

export type ValidateFunction<
  ValuesType,
  K extends keyof ValuesType,
  Error = unknown
> = (
  value: ValuesType[K],
  values: ValuesType,
  context: any
) => yup.Schema<any> | Error | undefined;

export type Validations<ValuesType> = {
  [K in keyof ValuesType]?:
    | yup.Schema<any>
    | ValidateFunction<ValuesType, K, unknown>;
};

export type DefaultError<
  ValuesType extends object,
  V extends Validations<ValuesType>
> = {
  [K in keyof ValuesType]?: DefaultValidationReturnType<V[K]>;
};

export type DefaultValidationReturnType<
  VF extends yup.Schema<any> | ValidateFunction<any, any> | undefined
> = VF extends yup.Schema<any>
  ? string[]
  : VF extends ValidateFunction<any, any, infer E>
  ? E extends yup.Schema<any>
    ? string[] | Exclude<E, yup.Schema<any>>
    : E
  : never;

export interface ValidateYupSchemaArgs<ValuesType, K extends keyof ValuesType> {
  value: ValuesType[K];
  values: ValuesType;
  schema: yup.Schema<any>;
  context: any;
}

export interface ValidateFunctionArgs<
  ValuesType,
  K extends keyof ValuesType,
  Error
> {
  value: ValuesType[K];
  values: ValuesType;
  validate: ValidateFunction<ValuesType, K, Error>;
  context: any;
}
