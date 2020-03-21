import React, { Reducer } from "react";
import * as yup from "yup";

import { ValidationTrigger } from "./constants/validationTrigger";
import { Field } from "./fields/Field";
import { FormArrayConfig } from "./form-config/FormArrayConfig";
import { FormArrayConfigHelper } from "./form-config/FormArrayConfigHelper";
import { FormConfig } from "./form-config/FormConfig";
import { FormConfigHelper } from "./form-config/FormConfigHelper";
import { FluentFormArrayActionTypes } from "./hooks/fluent-form-array/state-manager/reducer";
import { FluentFormActionTypes } from "./hooks/fluent-form/state-manager/reducer";

// -------------------- FluentForm --------------------

export interface UseFluentForm<Config extends FormConfig> {
  values: ExtractValuesType<Config>;
  touched: StateTouched<ExtractValuesType<Config>>;
  validity: StateValidity<ExtractValuesType<Config>>;
  errors: ExtractErrorsType<Config>;
  context: object;
  submitting: boolean;
  fields: MappedFields<ExtractFieldsType<Config>>;
  setValues: (values: Partial<ExtractValuesType<Config>>) => void;
  setInitialValues: (values: Partial<ExtractValuesType<Config>>) => void;
  setContext: (context: object) => void;
  handleSubmit: HandleSubmit;
  reset: () => void;
}

// FluentForm: state

export type StateValidity<ValuesType> = {
  [K in keyof ValuesType]?: boolean;
};
export type StateTouched<ValuesType> = {
  [K in keyof ValuesType]?: boolean;
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
  context: object;
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

// FluentForm: state setters

export type SetValue<V> = (value: V) => void;
export type SetTouched = (value?: boolean) => void;

// FluentForm: state manager

export interface UseFluentStateManager<Config extends FormConfig> {
  formConfigHelperRef: React.MutableRefObject<FormConfigHelper<Config>>;
  state: FluentFormState<ExtractValuesType<Config>, ExtractErrorsType<Config>>;
  setContext: (context: object) => void;
  setInitialValuesRef: (values: Partial<ExtractValuesType<Config>>) => void;
  setSubmittingResult: (errors: ExtractErrorsType<Config>) => void;
  setTouched: <K extends keyof ExtractFieldsType<Config>>(
    field: K,
    touched: boolean
  ) => void;
  setValidationFailure: <K extends keyof ExtractValuesType<Config>>(
    field: K,
    error: ExtractErrorsType<Config>
  ) => void;
  setValidationSuccess: <K extends keyof ExtractValuesType<Config>>(
    field: K
  ) => void;
  setValue: <K extends keyof ExtractValuesType<Config>>(
    field: K,
    value: ExtractValuesType<Config>[K],
    touched?: boolean
  ) => void;
  setValues: (values: Partial<ExtractValuesType<Config>>) => void;
  startSubmitting: () => void;
  reset: () => void;
}

// -------------------- FluentFormArray --------------------

export type FormArrayStates<
  T extends object,
  E extends ErrorsType<any, any>
> = FormItem<T, E>[];

export interface UseFluentFormArray<Config extends FormArrayConfig> {
  formArray: UseFluentFormItemArgs<Config>[];
  formStates: FormArrayStates<
    ExtractValuesType<Config>,
    ExtractErrorsType<Config>
  >;
  submitting: boolean;
  setInitialArray: (initialArray: ExtractValuesType<Config>[]) => void;
  addForm: AddForm<ExtractValuesType<Config>>;
  removeForm: (key: FormKey) => void;
  resetArray: () => void;
  getFormStateByKey: (
    key: FormKey
  ) =>
    | FormItem<ExtractValuesType<Config>, ExtractErrorsType<Config>>
    | undefined;
  handleSubmit: HandleSubmit;
}

// FluentFormArray: state

export interface FluentFormArrayState<ValuesType extends object, Errors> {
  submitting: boolean;
  formArray: FormArrayState<ValuesType, Errors>;
}

export interface FormArrayState<ValuesType extends object, Errors> {
  [key: string]: FormItem<ValuesType, Errors>;
}

export type FluentFormInitialStates<Config extends FormConfig> = {
  [key in FormKey]: FluentFormState<
    ExtractValuesType<Config>,
    ExtractErrorsType<Config>
  >;
};

// FluentFormArray: reducer

export type FluentFormArrayReducer<
  ValuesType extends object,
  Errors extends ErrorsType<ValuesType>
> = Reducer<
  FluentFormArrayState<ValuesType, Errors>,
  FluentFormArrayActionTypes<ValuesType, keyof ValuesType, Errors>
>;

// FluentFormArray: item

export type FormKey = number | string;

export interface UseFluentFormItemArgs<Config extends FormArrayConfig> {
  key: FormKey;
  config: Config;
  stateManager: UseFluentArrayStateManager<Config>;
}

export interface FormItem<ValuesType extends object, Errors>
  extends FluentFormState<ValuesType, Errors> {
  key: FormKey;
  sortPosition: number;
}

export interface UseFluentFormItem<Config extends FormConfig>
  extends UseFluentForm<Config> {
  key: FormKey;
  removeSelf: () => void;
}

// FluentFormArray: state manager

export interface UseFluentArrayStateManager<Config extends FormArrayConfig> {
  formConfigHelperRef: React.MutableRefObject<FormConfigHelper<Config>>;
  formArrayConfigHelperRef: React.MutableRefObject<
    FormArrayConfigHelper<Config>
  >;
  initalStateRefs: React.MutableRefObject<FluentFormInitialStates<Config>>;
  formArray: FormItem<ExtractValuesType<Config>, ExtractErrorsType<Config>>[];
  submitting: boolean;
  setInitialArrayRef: (initalArray: ExtractValuesType<Config>[]) => void;
  startSubmittingArray: () => void;
  setSubmittingResultForArray: (
    errors: FormArrayError<ExtractErrorsType<Config>>
  ) => void;

  resetArray: () => void;
  setContext: (key: FormKey, context: object) => void;
  setInitialValuesRef: (
    key: FormKey,
    values: Partial<ExtractValuesType<Config>>
  ) => void;
  setSubmittingResult: (
    key: FormKey,
    errors: ExtractErrorsType<Config>
  ) => void;
  setTouched: <K extends keyof ExtractFieldsType<Config>>(
    key: FormKey,
    field: K,
    touched: boolean
  ) => void;
  setValidationFailure: <K extends keyof ExtractValuesType<Config>>(
    key: FormKey,
    field: K,
    error: ExtractErrorsType<Config>[K]
  ) => void;
  setValidationSuccess: <K extends keyof ExtractValuesType<Config>>(
    key: FormKey,
    field: K
  ) => void;
  setValue: <K extends keyof ExtractValuesType<Config>>(
    key: FormKey,
    field: K,
    value: ExtractValuesType<Config>[K],
    touched?: boolean
  ) => void;
  setValues: (key: FormKey, values: Partial<ExtractValuesType<Config>>) => void;
  startSubmitting: (key: FormKey) => void;
  reset: (key: FormKey) => void;
  addForm: AddForm<ExtractValuesType<Config>>;
  removeForm: (key: FormKey) => void;
}

export type FormArrayError<Errors extends ErrorsType<any>> = {
  [key in FormKey]: Errors;
};

export interface AddFormArgs<ValuesType extends object> {
  initialValues?: Partial<ValuesType>;
  key?: FormKey;
}

export type AddForm<ValuesType extends object> = (
  args?: AddFormArgs<ValuesType>
) => void;

// -------------------- FormConfig & FormArrayConfig --------------------

export interface ShouldValidateOneChangeArgs {
  globalTrigger: ValidationTrigger;
  fieldTrigger: ValidationTrigger | undefined;
  touched: boolean | undefined;
}

export interface ShouldValidateOnBlurArgs {
  globalTrigger: ValidationTrigger;
  fieldTrigger: ValidationTrigger | undefined;
  touchedNow: boolean | undefined;
}

export type ExtractFieldsType<
  Config extends FormConfig
> = Config extends FormConfig<any, infer FieldsType> ? FieldsType : never;

export type ExtractValuesType<
  Config extends FormConfig
> = Config extends FormConfig<infer ValuesType> ? ValuesType : never;

export type ExtractErrorsType<
  Config extends FormConfig
> = Config extends FormConfig<any, any, infer Error> ? Error : never;

export type KeyGenerator<ValuesType> = (value: ValuesType) => FormKey;

// -------------------- Fields --------------------

export type Fields<ValuesType extends object = any> = {
  [K in keyof ValuesType]: Field<ValuesType[K]>;
};

// Fields: mapToComponentProps

export interface ComponentPropsMapperArgs<V> {
  value: V;
  setValue: SetValue<V>;
  setTouched: SetTouched;
}

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

// -------------------- Validation --------------------

// Validation: DefaultValidator

export type ValidateFunction<
  ValuesType,
  K extends keyof ValuesType,
  Error = unknown,
  Context extends object = any
> = (
  value: ValuesType[K],
  values: ValuesType,
  context: Context
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
  context: object;
}

export interface ValidateFunctionArgs<
  ValuesType,
  K extends keyof ValuesType,
  Error
> {
  value: ValuesType[K];
  values: ValuesType;
  validate: ValidateFunction<ValuesType, K, Error>;
  context: object;
}

// -------------------- HandleSubmit --------------------

export interface HandleSubmitOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export type HandleSubmit = (
  success?: Function,
  failure?: Function,
  options?: HandleSubmitOptions
) => (e?: any) => void;

export interface UseHandleSubmitArgs {
  submitting: boolean;
  valid: boolean;
  startSubmitting: () => void;
  submitAction: () => void;
}

// -------------------- Misc --------------------

export type Action<K, Payload = void> = Payload extends void
  ? { type: K }
  : { type: K; payload: Payload };
