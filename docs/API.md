# API documentation <!-- omit in toc -->

<details>
  <summary>
    Table of Contents
  </summary>

- [`Field`](#field)
  - [Type](#type)
  - [Description](#description)
  - [Generic types](#generic-types)
  - [Members](#members)
    - [`validateAfterTouchOnChange: () => Field`](#validateaftertouchonchange---field)
    - [`validateOnChange: () => Field`](#validateonchange---field)
    - [`validateOnSubmit: () => Field`](#validateonsubmit---field)
    - [`abstract mapToComponentProps: (args: ComponentPropsMapperArgs) => ComponentProps`](#abstract-maptocomponentprops-args-componentpropsmapperargs--componentprops)
- [`field`](#field-1)
  - [Type](#type-1)
  - [Description](#description-1)
  - [Members](#members-1)
    - [`checkbox: (initialChecked: boolean = false) => CheckboxField`](#checkbox-initialchecked-boolean--false--checkboxfield)
    - [`color: (initialValue: string = "") => TextField`](#color-initialvalue-string----textfield)
    - [`date: (initialValue: string = "") => TextField`](#date-initialvalue-string----textfield)
    - [`datetimeLocal: (initialValue: string = "") => TextField`](#datetimelocal-initialvalue-string----textfield)
    - [`email: (initialValue: string = "") => TextField`](#email-initialvalue-string----textfield)
    - [`image: (initialValue: string = "") => TextField`](#image-initialvalue-string----textfield)
    - [`month: (initialValue: string = "") => TextField`](#month-initialvalue-string----textfield)
    - [`number: (initialValue: string = "") => TextField`](#number-initialvalue-string----textfield)
    - [`password: (initialValue: string = "") => TextField`](#password-initialvalue-string----textfield)
    - [`radio: (initialValue: string = "") => RadioField`](#radio-initialvalue-string----radiofield)
    - [`range: (initialValue: string = "") => TextField`](#range-initialvalue-string----textfield)
    - [`search: (initialValue: string = "") => TextField`](#search-initialvalue-string----textfield)
    - [`tel: (initialValue: string = "") => TextField`](#tel-initialvalue-string----textfield)
    - [`text: (initialValue: string = "") => TextField`](#text-initialvalue-string----textfield)
    - [`time: (initialValue: string = "") => TextField`](#time-initialvalue-string----textfield)
    - [`url: (initialValue: string = "") => TextField`](#url-initialvalue-string----textfield)
    - [`week: (initialValue: string = "") => TextField`](#week-initialvalue-string----textfield)
    - [`textarea: (initialValue: string = "") => TextAreaField`](#textarea-initialvalue-string----textareafield)
    - [`select: (initialValue: string = "") => SelectField`](#select-initialvalue-string----selectfield)
    - [`raw: <ValueType>(initialValue: ValueType) => RawField`](#raw-valuetypeinitialvalue-valuetype--rawfield)
- [`addField`](#addfield)
  - [Type](#type-2)
  - [Descripiton](#descripiton)
- [`createForm`](#createform)
  - [Type](#type-3)
  - [Description](#description-2)
  - [Generic types](#generic-types-1)
  - [Arguments](#arguments)
  - [Example](#example)
- [`Validator`](#validator)
  - [Type](#type-4)
  - [Description](#description-3)
  - [Generic types](#generic-types-2)
  - [Members](#members-2)
    - [`abstract validateField: <K extends keyof ValuesType>(field: K, values: ValuesType, context?: any) => Errors[K] | void`](#abstract-validatefield-k-extends-keyof-valuestypefield-k-values-valuestype-context-any--errorsk--void)
    - [`validateAllFields: (values: ValuesType, context?: any) => Errors`](#validateallfields-values-valuestype-context-any--errors)
- [`FormConfig`](#formconfig)
  - [Type](#type-5)
  - [Description](#description-4)
  - [Generic types](#generic-types-3)
  - [Members](#members-3)
    - [`validateAfterTouchOnChange: () => FormConfig`](#validateaftertouchonchange---formconfig)
    - [`validateOnChange: () => FormConfig`](#validateonchange---formconfig)
    - [`validateOnSubmit: () => FormConfig`](#validateonsubmit---formconfig)
    - [`validateOnContextChange: (validate: boolean = true) => FormConfig`](#validateoncontextchange-validate-boolean--true--formconfig)
    - [`withInitialValues: (values: Partial<ValuesType>) => FormConfig`](#withinitialvalues-values-partialvaluestype--formconfig)
    - [`withContext: (context: any) => FormConfig`](#withcontext-context-any--formconfig)
    - [`withValidation: (validations: Validations) => FormConfig`](#withvalidation-validations-validations--formconfig)
    - [`withCustomValidator: (validator: Validator) => FormConfig`](#withcustomvalidator-validator-validator--formconfig)
- [`useFluentForm`](#usefluentform)
  - [Type](#type-6)
  - [Description](#description-5)
  - [Return type](#return-type)
    - [`values: ValuesType`](#values-valuestype)
    - [`touched: StateTouched`](#touched-statetouched)
    - [`validity: StateValidity`](#validity-statevalidity)
    - [`errors: ErrorsType<ValuesType, ErrorType>`](#errors-errorstypevaluestype-errortype)
    - [`context: any`](#context-any)
    - [`submitting: boolean`](#submitting-boolean)
    - [`fields: Fields<ValuesType>`](#fields-fieldsvaluestype)
    - [`setValues: (values: Partial<ValuesType>) => void`](#setvalues-values-partialvaluestype--void)
    - [`setInitialValues: (values: Partial<ValuesType>) => void`](#setinitialvalues-values-partialvaluestype--void)
    - [`setContext: (context: Partial<ValuesType>) => void`](#setcontext-context-partialvaluestype--void)
    - [`handleSubmit: (success?: Function, failure?: Function, options?: HandleSubmitOptions) => (event: any) => void`](#handlesubmit-success-function-failure-function-options-handlesubmitoptions--event-any--void)
    - [`reset: () => void`](#reset---void)

</details>

## `Field`

### Type

`abtract class`

### Description

This is the base class of all fields. Custom fields need to extend this class or any subclass.

### Generic types

`ValueType`

Type of the maintained value

`ComponentProps`

Type of component props after mapping functions/state of `useFluenForm` passed to `mapToComponentProps` (see below)

### Members

> **NOTE:** Most member functions return `this` to enable fluent API.

#### `validateAfterTouchOnChange: () => Field`

Configures field to trigger validation once it was touched, then always if it has changed and on submit.  
 This is the `default` validation trigger.

#### `validateOnChange: () => Field`

Configures field to trigger validation everytime it has changed and on submit.

#### `validateOnSubmit: () => Field`

Configures field to trigger validation only on submit.

#### `abstract mapToComponentProps: (args: ComponentPropsMapperArgs) => ComponentProps`

Since this function is `abstract` it needs to be implemented by each subclass.  
This member is only relevant when adding custom fields and receives a parameter with following properties:

- `value: ValueType`: the current value stored in state of `useFluentForm`. Map this to the value prop of your component.
- `setValue(v: ValueType)`: whenever your component changed its value, this function should be called (often it's an `onChange`-like event)
- `setTouched(value: boolean = true)`: call this function when your component has been touched. For most cases this function should be called when the `onBlur` event was triggered.

Following is an example implementation of a clearable custom text field, which makes use of `mapToComponentProps`.

```ts
import React from "react";
import { Field } from "react-fluent-form";

export type ClearableTextFieldProps = {
  value: string;
  clearable: boolean;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
};

export class ClearableTextField extends Field<string, ClearableTextFieldProps> {
  private clearable: boolean;

  constructor(initialValue = "") {
    super(initialValue);
    this.clearable = true;
  }

  // add functions to configure your field
  // NOTE: configuration functions should always return "this" to stay conform to the fluent API syntax
  public isClearable = (value: boolean = true) => {
    this.clearable = value;
    return this;
  };

  public mapToComponentProps: ComponentPropsMapper<
    string,
    ClearableTextFieldProps
  > = ({ value, setValue, setTouched }) => ({
    value,
    clearable: this.clearable,
    onBlur: () => {
      setTouched();
    },
    onChange: e => {
      setValue(e.target.value);
    },
    onClear: () => {
      setValue("");
    }
  });
}
```

It's recommended to add custom fields using [`addField`](#addfield).

## `field`

### Type

Instance of #### `FieldCreator`

### Description

`field` is responsible for creating fields required by `createForm`/`FormConfig`.
It specifies a member function for each HTML `input` type, `select` and `textarea`. There is also a function for `raw`fields. A custom field can be attached using [`addField`](#addfield).

### Members

For `input`s use following members:

#### `checkbox: (initialChecked: boolean = false) => CheckboxField`

#### `color: (initialValue: string = "") => TextField`

#### `date: (initialValue: string = "") => TextField`

#### `datetimeLocal: (initialValue: string = "") => TextField`

#### `email: (initialValue: string = "") => TextField`

#### `image: (initialValue: string = "") => TextField`

#### `month: (initialValue: string = "") => TextField`

#### `number: (initialValue: string = "") => TextField`

#### `password: (initialValue: string = "") => TextField`

#### `radio: (initialValue: string = "") => RadioField`

#### `range: (initialValue: string = "") => TextField`

#### `search: (initialValue: string = "") => TextField`

#### `tel: (initialValue: string = "") => TextField`

#### `text: (initialValue: string = "") => TextField`

#### `time: (initialValue: string = "") => TextField`

#### `url: (initialValue: string = "") => TextField`

#### `week: (initialValue: string = "") => TextField`

For `select`, `textarea` and `raw` use following members:

> **NOTE:** For `raw` fields an initial value is required!

#### `textarea: (initialValue: string = "") => TextAreaField`

#### `select: (initialValue: string = "") => SelectField`

#### `raw: <ValueType>(initialValue: ValueType) => RawField`

## `addField`

### Type

`(fieldName: string, (...args: any[]) => Field) => void`

### Descripiton

Adds a custom field to [`field`](#field-1) (`FieldCreator.prototype`) so it can be used just like the pre-defined fields. `addField` statments should be placed in a top level file.

```ts
import { addField } from "react-fluent-form";

// only necessary for typescript because types need to be known at compile time
declare module "react-fluent-form" {
  interface FieldCreator {
    clearableText: (initalValue: string) => ClearableTextField;
  }
}

addField("clearableText", intialValue => new ClearableTextField(initialValue));
```

Usage:

```tsx
const formConfig = createForm()({
  username: field.clearableText("initial value").isClearable(false)
});
```

## `createForm`

### Type

`<ValuesType>() => (fields: Fields) => FormConfig`

### Description

`creatForm` is a curried function that can be used to create an instance of [`FormConfig`](#formconfig).

> **_Why is it curried?_**  
> Typescript has a missing feature called [`partial type argument inference`](https://github.com/Microsoft/TypeScript/pull/26349) which has some work arrounds, one of them is to use curried functions. This issue is well known and part of typescript current roadmap. Once this feature is introduced the API will be changed accordingly.

### Generic types

`ValuesType`

Type of field values.

### Arguments

`field: Fields`

Object of fields (s. [Field](#field) for configuration details).  
Needs to match with properties of `ValuesType`.

### Example

```ts
type RegistrationForm = { username: string; password: string };

const formConfig = createForm<RegistrationForm>()({
  username: field.text(),
  password: field.password()
});

// values will be of type RegistrationForm
const { values } = useFluentForm(formConfig);
```

## `Validator`

### Type

`abstract calss`

### Description

Base class of `DefaultValidator`, which is used for form validation by default (s. `withValidation` below). Can be extended to add custom validator (s. `withCustomValidator` below).

### Generic types

`ValuesType`

Type of field values.

`Errors`

Type of errors object. Needs to extend `ErrorsType`.

### Members

#### `abstract validateField: <K extends keyof ValuesType>(field: K, values: ValuesType, context?: any) => Errors[K] | void`

Validates one form field and returns validation error for field in case of validation failure else nothing. Needs to be overriden when custom validator is required.

#### `validateAllFields: (values: ValuesType, context?: any) => Errors`

Validates all fields based on `validateField`. Can be overriden to e.g. improve performance.

## `FormConfig`

### Type

`class`

### Description

Stores configuration of form like validation and fields. It's the only argument that needs to be passed to [useFluentForm](#usefluentform).  
It's recommended to use [createForm](#createform) to create a form config.

### Generic types

`ValuesType`

Type of field values.

### Members

> **NOTE:** Every member function returns `this` to enable fluent API.

> **IMPORTANT:**  
> Validation triggers defined on [`Field`](#field) level are always considered first. `FormConfig` level validation triggers will only be used when no trigger is defiend on `Field` level.

#### `validateAfterTouchOnChange: () => FormConfig`

Configures validation for all fields to trigger once they touched, then always if they have changed and on submit.  
 This is the `default` validation trigger.

#### `validateOnChange: () => FormConfig`

Configures validation for all fields to trigger everytime they have changed and on submit.

#### `validateOnSubmit: () => FormConfig`

Configures validation for all fields to trigger only on submit.

#### `validateOnContextChange: (validate: boolean = true) => FormConfig`

Configures validation for all fields to be triggered when context has changed. The default value is `false`.  
 Context changes are triggerd by `setContext` function return by [`useFluentForm`](#usefluentform).

#### `withInitialValues: (values: Partial<ValuesType>) => FormConfig`

While initial values can be set on [`Field`](#field) level (e.g. `field.text("initial")`) it's also possible to do so on `FormConfig` level for all fields.

```ts
const formConfig = createForm<UserForm>()({
  username: field.text("initial"),
  email: field.email()
}).withInitialValues({ email: "email@example.com" });
```

#### `withContext: (context: any) => FormConfig`

Sets the initial context value. It needs to be an object of any type.  
 It's recommend to wrap your context values in a `context` field (s. `withValidation` below for more details):

```ts
const formConfig = createForm<UserForm>()({
  username: field.text(),
  email: field.email()
}).withContext({
  context: {
    // values are wrapped here
    shouldValidateUsername: true
  }
});
```

#### `withValidation: (validations: Validations) => FormConfig`

Adds functionality to validate the form. A `yup.Schema` or a custom `validate function` can be provided for each field. Behind the scenes `DefaultValidator` is being used.

A `validate function` receives following values as paramater:

- `value`: current value of field
- `values`: current values of all fields in the form
- `context`: current context value

Using a `yup.Schema` will always result in an `string[]` error type.
In contrast to that `validate function` allow any kind of error type to be returned. Returning nothing (`undefined`) will indicate that there is no validation error.  
On top of that also a `yup.Schema` can be return by a `validate functions` which enables conditional `yup.Schema` validation. In this case the error type will also be from type `string[]`. To say it in other words: returning a `yup.Schema` in a `validate function` will result in an evaulation of the returned `yup.Schema`.

> **IMPORTANT:**  
> When using `yup validation` other form fields need to be accessed with a leading `$` (here `$lastName`) which usually means the value is coming from the context. In fact other form values are passed as context to the `yup schema` for each field during validation execution.  
> To clearly seperate context values from field values it's recommened to wrap actual context values in a `context` field (as mentioned in `withContext`)

```ts
formConfig.withValidation({
  username: yup.string().required(),
  firstName: yup.string().when("$lastName", {
    is: "",
    otherwise: yup.string().required()
  }),
  lastName: yup.string(),
  // the error type will be "string | string[]" for this validate function
  password: (value, values, _context) => {
    if (value.includes(values.username)) {
      return "Password should not contain username";
    } else {
      return yup
        .string()
        .required()
        .matches(/[a-zA-Z]/, "Password can only contain letters.");
    }
  }
});
```

#### `withCustomValidator: (validator: Validator) => FormConfig`

Allows to provide a custom [`Validator`](#validator).  
 Providing such will remove `DefaultValidator`, thus removes all features mentioned in `withValdation`.

Following is an example of a simple validator that does truthy checks on fields:

```ts
import { Validator, ErrorsType } from "react-fluent-form";

export class RequiredValidator<ValuesType> extends Validator<
  ValuesType,
  ErrorsType<string>
> {
  constructor(requiredFields) {
    super();
    this.requiredFields = requiredFields;
  }

  public validateField<K extends keyof ValuesType>(
    field: K,
    values: ValuesType,
    _context: any // not relevant for this example
  ) {
    if (this.requiredFields[field] && !values[field]) {
      return "field is required";
    }
  }
}
```

Usage:

```ts
const formConfig = createForm()({
  username: field.text(),
  email: field.email(),
  phone: field.tel()
}).withCustomValidator(new RequiredValidator({
  username: true,
  email: true
});
```

## `useFluentForm`

### Type

`<Config extends FormConfig>(config: Config) => FluentFormReturnType`

### Description

Core react hook of this library.
Expects only a [`FormConfig`](#formconfig) as parameter:

```ts
// ValuesType
type RegistrationForm = { username: string; password: string };

const formConfig = createForm<RegistrationForm>()({
  username: field.text(),
  password: field.password()
});

const {
  values,
  touched,
  validity,
  errors,
  context,
  submitting,
  fields,
  setValues,
  setInitialValues,
  setContext,
  handleSubmit,
  reset
} = useFluentForm(formConfig);
```

### Return type

#### `values: ValuesType`

Contains current values of form. Initial values are comming from [`FormConfig`](#formconfig)

#### `touched: StateTouched`

Contains information about the touched state of each field.
Initial value is `{}`.  
Usually field are touched once `onBlur` event was triggered for the field.
This can help to trigger validations depended on the specified validation trigger.

Possible values for each field:

- `undefined`: field was not touched yet
- `true`: field was touched

```ts
{
  username: true,
  password: undefined
}
```

#### `validity: StateValidity`

Contains information about the validation state of each field. Initial value is `{}`.

Possible values for each field:

- `undefined`: validation was not triggert yet
- `true`: field is valid
- `false`: field is invalid

```ts
{
  username: true,
  password: false
}
```

#### `errors: ErrorsType<ValuesType, ErrorType>`

Contains errors for each field resulted from it's validation. Initial value is `{}`.

Possible values for each field:

- `undefined`: field has no error or was not validated yet
- For `yup.Schema`'s the `ErrorType` will always be `string[]`
- For `validate function`'s the `ErrorType` could possibly be anything

```ts
{
  username: ["username is a required field"],
  password: 1 // only possible with validate function
}
```

#### `context: any`

Current context value. Initial value is `undefined`.

#### `submitting: boolean`

`true` if form is currently submitting else `false`.

#### `fields: Fields<ValuesType>`

Contains props for each component which resulted from evaluation of `mapToComponentProps` member function of each field (s. [`Field`](#field)).

```tsx
const formConfig = createForm<RegistrationForm>()({
  username: field.text(), // field.text() has a mapToComponentProps function
  password: field.password() // just like field.password() and all other fields have
});

const MyForm = () => {
  const { fields } = useFluentForm(fromConfig);

  return (
    <input {...fields.username}/>
    <input {...fields.password}/>
  )
}
```

#### `setValues: (values: Partial<ValuesType>) => void`

Sets values of form.

#### `setInitialValues: (values: Partial<ValuesType>) => void`

Sets initial values of form. This is important when resetting a form.

#### `setContext: (context: Partial<ValuesType>) => void`

Updates value of validation context. To re-validate all fields on context change `FormConfig.validateOnContextChange` can be used.
Works well in combinations with `useEffect`.

```jsx
const { setContext } = useFluentForm(formConfig.validateOnContextChange());

useEffect(() => {
  setContext({ context: coordinates });
}, [coordinates]);
```

#### `handleSubmit: (success?: Function, failure?: Function, options?: HandleSubmitOptions) => (event: any) => void`

Returns a submit handler. When this handler is called validation for all fields will be trigger no matter which validation trigger was configured.

Following parameter can be passed:

- `success`: a callback when the validation was successful
- `failure`: a callback when the validation has failed
- `options`
  - `preventDefault`: will call `preventDefault` function in case submit handler passes an event. Default value is `true`
  - `stopPropagation`: will call `stopPropagation` function in case submit handler passes an event. Default value is `true`

```tsx
formConfig.withValidation({
  username: yup.string().required(),
  password: yup.string().required().min(8)
  }
});

function LoginForm() {
  const {
    values,
    touched,
    validity,
    errors,
    fields,
    handleSubmit
  } = useFluentForm(formConfig);

  const handleSubmitSuccess = () => console.log(values);

  const handleSubmitFailure = () => console.log(errors);

  return (
    <form onSubmit={handleSubmit(
      handleSubmitSuccess,
      handleSubmitFailure,
      // these are default options
      { preventDefault: true, stopPropagtion: true }
    )}>
        <input {...fields.username} />
        <input {...fields.password} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### `reset: () => void`

Sets complete form state to inital state. Initial values can be modified using `setInitialValues`.
