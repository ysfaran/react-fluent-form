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
    - [`validateOnSubmitOnly: () => Field`](#validateonsubmitonly---field)
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
      - [Additional configuration](#additional-configuration)
      - [Description](#description-2)
    - [`range: (initialValue: string = "") => TextField`](#range-initialvalue-string----textfield)
    - [`search: (initialValue: string = "") => TextField`](#search-initialvalue-string----textfield)
    - [`tel: (initialValue: string = "") => TextField`](#tel-initialvalue-string----textfield)
    - [`text: (initialValue: string = "") => TextField`](#text-initialvalue-string----textfield)
    - [`time: (initialValue: string = "") => TextField`](#time-initialvalue-string----textfield)
    - [`url: (initialValue: string = "") => TextField`](#url-initialvalue-string----textfield)
    - [`week: (initialValue: string = "") => TextField`](#week-initialvalue-string----textfield)
    - [`textarea: (initialValue: string = "") => TextAreaField`](#textarea-initialvalue-string----textareafield)
    - [`select: (initialValue: string = "") => SelectField`](#select-initialvalue-string----selectfield)
      - [Description](#description-3)
    - [`raw: <ValueType>(initialValue: ValueType) => RawField`](#raw-valuetypeinitialvalue-valuetype--rawfield)
      - [Additional configuration](#additional-configuration-1)
      - [Description](#description-4)
- [`addField`](#addfield)
  - [Type](#type-2)
  - [Descripiton](#descripiton)
- [`createForm`](#createform)
  - [Type](#type-3)
  - [Description](#description-5)
  - [Generic types](#generic-types-1)
  - [Arguments](#arguments)
  - [Example](#example)
- [`createFormArray`](#createformarray)
  - [Type](#type-4)
  - [Description](#description-6)
  - [Generic types](#generic-types-2)
  - [Arguments](#arguments-1)
  - [Example](#example-1)
- [`Validator`](#validator)
  - [Type](#type-5)
  - [Description](#description-7)
  - [Generic types](#generic-types-3)
  - [Members](#members-2)
    - [`abstract validateField: <K extends keyof ValuesType>(field: K, values: ValuesType, context: object) => Errors[K] | void`](#abstract-validatefield-k-extends-keyof-valuestypefield-k-values-valuestype-context-object--errorsk--void)
    - [`validateAllFields: (values: ValuesType, context: object) => Errors`](#validateallfields-values-valuestype-context-object--errors)
- [`FormConfig`](#formconfig)
  - [Type](#type-6)
  - [Description](#description-8)
  - [Generic types](#generic-types-4)
  - [Members](#members-3)
    - [`validateAfterTouchOnChange: () => FormConfig`](#validateaftertouchonchange---formconfig)
    - [`validateOnChange: () => FormConfig`](#validateonchange---formconfig)
    - [`validateOnSubmitOnly: () => FormConfig`](#validateonsubmitonly---formconfig)
    - [`validateOnContextChange: (validate: boolean = true) => FormConfig`](#validateoncontextchange-validate-boolean--true--formconfig)
    - [`withInitialValues: (values: Partial<ValuesType>) => FormConfig`](#withinitialvalues-values-partialvaluestype--formconfig)
    - [`withContext: (context: object) => FormConfig`](#withcontext-context-object--formconfig)
    - [`withValidation: (validations: Validations) => FormConfig`](#withvalidation-validations-validations--formconfig)
    - [`withCustomValidator: (validator: Validator) => FormConfig`](#withcustomvalidator-validator-validator--formconfig)
- [`FormArrayConfig`](#formarrayconfig)
  - [Type](#type-7)
  - [Description](#description-9)
  - [Generic types](#generic-types-5)
  - [Members](#members-4)
    - [`withInitialArray: (initialArray: ValuesType[]) => FormArrayConfig`](#withinitialarray-initialarray-valuestype--formarrayconfig)
    - [`withKeyGenerator: (generator: KeyGenerator<ValuesType>) => FormConfig`](#withkeygenerator-generator-keygeneratorvaluestype--formconfig)
- [`useFluentForm`](#usefluentform)
  - [Type](#type-8)
  - [Description](#description-10)
  - [Return type](#return-type)
    - [`values: ValuesType`](#values-valuestype)
    - [`touched: StateTouched`](#touched-statetouched)
    - [`validity: StateValidity`](#validity-statevalidity)
    - [`errors: ErrorsType<ValuesType, ErrorType>`](#errors-errorstypevaluestype-errortype)
    - [`context: object`](#context-object)
    - [`submitting: boolean`](#submitting-boolean)
    - [`fields: Fields<ValuesType>`](#fields-fieldsvaluestype)
    - [`setValues: (values: Partial<ValuesType>) => void`](#setvalues-values-partialvaluestype--void)
    - [`setInitialValues: (values: Partial<ValuesType>) => void`](#setinitialvalues-values-partialvaluestype--void)
    - [`setContext: (context: object) => void`](#setcontext-context-object--void)
    - [`handleSubmit: (success?: Function, failure?: Function, options?: HandleSubmitOptions) => (event: any) => void`](#handlesubmit-success-function-failure-function-options-handlesubmitoptions--event-any--void)
    - [`reset: () => void`](#reset---void)
- [`useFluentFormArray`](#usefluentformarray)
  - [Type](#type-9)
  - [Description](#description-11)
  - [Return type](#return-type-1)
    - [`formArray: UseFluentFormItemArgs[]`](#formarray-usefluentformitemargs)
    - [`formStates: FormArrayStates`](#formstates-formarraystates)
    - [`submitting: boolean`](#submitting-boolean-1)
    - [`addForm: (args?: AddFormArgs) => void`](#addform-args-addformargs--void)
    - [`setInitialArray: (initialArray: ValuesType[]) => void`](#setinitialarray-initialarray-valuestype--void)
    - [`removeForm: (key: string | number) => void`](#removeform-key-string--number--void)
    - [`getFormStateByKey: (key: string | number) => FormItem | undefined`](#getformstatebykey-key-string--number--formitem--undefined)
    - [`handleSubmit: (success?: Function, failure?: Function, options?: HandleSubmitOptions) => (event: any) => void`](#handlesubmit-success-function-failure-function-options-handlesubmitoptions--event-any--void-1)
    - [`resetArray: () => void`](#resetarray---void)
- [`useFluentFormItem`](#usefluentformitem)
  - [Type](#type-10)
  - [Description](#description-12)
  - [Return type](#return-type-2)
    - [`key: string | number`](#key-string--number)
    - [`removeSelf: () => void`](#removeself---void)

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

#### `validateOnSubmitOnly: () => Field`

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

Instance of `FieldCreator`

### Description

`field` is responsible for creating fields required by `createForm`/`FormConfig`.
It specifies a member function for each HTML `input` type, `select` and `textarea`. There is also a function for `raw`fields. A custom field can be attached using [`addField`](#addfield).

### Members

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

##### Additional configuration

- `name: (value: string) => RadioField`: value for the `name` property passed to `<input />`'s
- `unselectable: (value = true) => RadioField`: option to unselect a radio option by clicking on it again

##### Description

```tsx
const formConfig = createForm()({
  gender: field
    .radio()
    .name("gender")
    // allows to select nothing
    .unselectable()
});

const GenderForm = () => {
  const { fields } = useFluentForm(formConfig);

  return (
    <div>
      Gender:
      <label>
        male
        <input {...fields.gender("male")} />
      </label>
      <label>
        female
        <input {...fields.gender("female")} />
      </label>
    </div>
  );
};
```

#### `range: (initialValue: string = "") => TextField`

#### `search: (initialValue: string = "") => TextField`

#### `tel: (initialValue: string = "") => TextField`

#### `text: (initialValue: string = "") => TextField`

#### `time: (initialValue: string = "") => TextField`

#### `url: (initialValue: string = "") => TextField`

#### `week: (initialValue: string = "") => TextField`

#### `textarea: (initialValue: string = "") => TextAreaField`

#### `select: (initialValue: string = "") => SelectField`

##### Description

```tsx
const formConfig = createForm()({
  role: field.select("admin")
});

const RolesForm = () => {
  const { fields } = useFluentForm(formConfig);

  return (
    <select {...fields.role.select}>
      <option {...fields.role.option("admin")}>Admin</option>
      <option {...fields.role.option("user")}>User</option>
    </select>
  );
};
```

#### `raw: <ValueType>(initialValue: ValueType) => RawField`

##### Additional configuration

- `withValueProp: (valueProp: string) => void`: name of the `value` property of the component
- `withOnChangeProp: (onChangeProp: string) => void`: name of the `onChange` property of the component
- `withOnBlurProp: (onBlurProp: string) => void`: name of the `onBlur` property of the component

##### Description

For components like [`react-datepicker`](https://www.npmjs.com/package/react-datepicker) it's not necessary to implement a custom field.
`react-fluent-form` comes with a raw field type which works for components with following characteristics:

- it has `value`-like and a `onChange`-like prop
- `value` has the same type as the first parameter of `onChange` handler.  
- it optionally has a `onBlur`-like prop to indicate when the field is touched

*-like means it must not have the same name, but the same type. E.g. the `value` prop in `react-datepicker` is called `selected`.

For raw fields it's required to pass an initial value, otherwise it will be undefined.

```jsx
const formConfig = createForm()({
  dateOfBirth: field.raw(new Date())
});

const MyForm = () => {
  const { fields } = useFluentForm(formConfig);
};
```

The type of `fields` object would look like this:

```ts
type FieldsType = {
  dateOfBirth: {
    value: Date;
    onChange: (newValue: Date) => void;
    onBlur: () => void; // will just set the "touched" state to true
  };
};
```

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
    clearableText: (initalValue?: string) => ClearableTextField;
  }
}

addField(
  "clearableText",
  (initalValue = "") => new ClearableTextField(initialValue)
);
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

`createForm` is a curried function that can be used to create an instance of [`FormConfig`](#formconfig).

> **_Why is it curried?_**  
> Typescript has a missing feature called [`partial type argument inference`](https://github.com/Microsoft/TypeScript/pull/26349) which has some work arrounds, one of them is to use curried functions. This issue is well known and part of typescript current roadmap. Once this feature is introduced the API will be changed accordingly.

### Generic types

`ValuesType`

Type of field values.

### Arguments

`field: Fields`

Object of fields (see [Field](#field) for configuration details).  
Needs to match with properties of `ValuesType`.

### Example

```ts
interface RegistrationForm {
  username: string;
  password: string;
}

const formConfig = createForm<RegistrationForm>()({
  username: field.text(),
  password: field.password()
});

// values will be of type RegistrationForm
const { values } = useFluentForm(formConfig);
```

## `createFormArray`

### Type

`<ValuesType>() => (fields: Fields) => FormArrayConfig`

### Description

`creatFormArray` is a curried function - like [`createForm`](#createform) - that can be used to create an instance of [`FormArrayConfig`](#formarrayconfig).

### Generic types

`ValuesType`

Type of field values.

### Arguments

`field: Fields`

Object of fields (see [Field](#field) for configuration details).  
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

Base class of `DefaultValidator`, which is used for form validation by default (see [`withValidation`](#withvalidation-validations-validations--formconfig)). Can be extended to add custom validator (see [`withCustomValidator`](#withcustomvalidator-validator-validator--formconfig)).

### Generic types

`ValuesType`

Type of field values.

`Errors`

Type of errors object. Needs to extend `ErrorsType`.

### Members

#### `abstract validateField: <K extends keyof ValuesType>(field: K, values: ValuesType, context: object) => Errors[K] | void`

Validates one form field and returns validation error for field in case of validation failure else nothing. Needs to be overriden when custom validator is implemented.

#### `validateAllFields: (values: ValuesType, context: object) => Errors`

Validates all fields based on `validateField`. Can be overriden to e.g. improve performance.

## `FormConfig`

### Type

`class`

### Description

Stores configuration of form like validation and fields. It's the only argument that needs to be passed to [useFluentForm](#usefluentform).  
It's recommended to use [createForm](#createform) to create an instance of `FormConfig`.

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

#### `validateOnSubmitOnly: () => FormConfig`

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

#### `withContext: (context: object) => FormConfig`

Sets the initial context value. **It needs to be an object of any type**.  
 It's recommend to wrap context values in a `context` field (see `withValidation` below for more details):

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
On top of that also a `yup.Schema` can be returned by a `validate functions` which enables conditional `yup.Schema` validation. In this case the error type will also be from type `string[]`. To say it in other words: returning a `yup.Schema` in a `validate function` will result in an evaulation of the returned `yup.Schema`.

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
    _context: object // not relevant for this example
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

## `FormArrayConfig`

### Type

`class`, extends [`FormConfig`](#formconfig)

### Description

Stores configuration of form array like validation and fields, but also configuration about the array (e.g. inital array values). It's the only argument that needs to be passed to [useFluentFormArray](#usefluentformarray).  
It's recommended to use [createFormArray](#createformarray) to create a form array config.

### Generic types

`ValuesType`

Type of field values.

### Members

> **NOTE:** Every member function returns `this` to enable fluent API.

For form item level configuration refer to [`FormConfig`](#formconfig) since it has the same configuration options as `FormArrayConfig`. Following members are **only** relevant on array level:

#### `withInitialArray: (initialArray: ValuesType[]) => FormArrayConfig`

Sets initial values of the form array.

#### `withKeyGenerator: (generator: KeyGenerator<ValuesType>) => FormConfig`

To identify items in a form array they need a unique key assigned to them. On default keys are generated with a key counter. That behaviour can be overriden by specifying a `KeyGenerator` which has type `(item: ValuesType) => string | number`:

```ts
interface UserRoleForm {
  username: string;
  role: string;
}

const arrayConfig = createFormArray<UserRoleForm>()({
  username: field.text(),
  role: field.select()
}).withKeyGenerator(item => item.username);
```

## `useFluentForm`

### Type

`<Config extends FormConfig>(config: Config) => UseFluentForm`

### Description

Core react hook of this library.
Expects a [`FormConfig`](#formconfig) as parameter:

```ts
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
Usually fields are touched once `onBlur` event was triggered for the field.
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

#### `context: object`

Current context value. Initial value is `{}`.

#### `submitting: boolean`

`true` if form is currently submitting else `false`.

#### `fields: Fields<ValuesType>`

Contains props for each component which resulted from evaluation of `mapToComponentProps` member function of each field (see [`Field`](#field)).

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

#### `setContext: (context: object) => void`

Updates value of validation context. To re-validate all fields on context change `FormConfig.validateOnContextChange` can be used.
Works well in combination with `useEffect`.

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
      // these are the default values
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

## `useFluentFormArray`

### Type

`<Config extends FormArrayConfig>(config: Config) => UseFluentFormArray`

### Description

Hook to create form arrays.
Expects a [`FormArrayConfig`](#formarrayconfig) as parameter:

```ts
type UserRoleForm = { username: string; role: string };

const arrayConfig = createFormArray<UserRoleForm>()({
  username: field.text(),
  role: field.select()
}).withInitalArray([{ username: "ysfaran", role: "admin" }]);

const {
  formArray,
  formStates,
  submitting,
  setInitialArray,
  addForm,
  removeForm,
  resetArray,
  getFormStateByKey,
  handleSubmit
} = useFluentFormArray(arrayConfig);
```

### Return type

#### `formArray: UseFluentFormItemArgs[]`

Contains all items that need to be passed to [`useFluentFormItem`](#usefluentformitem).

```tsx
const UserRoleFormArray = () => {
  const { formArray } = useFluentFormArray(arrayConfig);

  return formArray.map(item => <UserRoleForm key={item.key} formItem={item} />);
};
```

```tsx
interface UserRoleFormProps {
  formItem: UseFluentFormItemArgs<typeof arrayConfig>;
}

const UserRoleForm: React.FC<UserRoleFormProps> = ({ formItem }) => {
  const { fields } = useFluentFormItem(arrayConfig);

  return (
    <div>
      <label>
        Username:
        <input {...fields.username} />
      </label>
      {/* ... */}
    </div>
  );
};
```

#### `formStates: FormArrayStates`

Array that contains information about states of each form item.
The state is equally structured as the state returned by [`useFluentForm`](#usefluentform), but contains an additional `key` prop to identify the item:

```tsx
const { formStates } = useFluentFormArray(arrayConfig);
const { key, values, errors /* ... */ } = formStates[0];
```

#### `submitting: boolean`

`true` if form array is currently submitting else `false`.

#### `addForm: (args?: AddFormArgs) => void`

Add new item to form array.

`AddFormArgs`:

```ts
{
  // default: initial values of FormArrayConfig
  initialValues?: Partial<ValuesType>;
  // default: key counter or key generator passed to withKeyGenerator
  key?: string | number;
}
```

#### `setInitialArray: (initialArray: ValuesType[]) => void`

Sets initial array values of form array. This is important when resetting a form array.

#### `removeForm: (key: string | number) => void`

Removes form item with specified `key` from the form array.

#### `getFormStateByKey: (key: string | number) => FormItem | undefined`

Returns state of form item with specified key or `undefined` in case item is not in the form array.

#### `handleSubmit: (success?: Function, failure?: Function, options?: HandleSubmitOptions) => (event: any) => void`

Returns a submit handler. When this handler is called validation for all fields in all form items will be triggered. Works equally to [`handleSubmit`](#handlesubmit-success-function-failure-function-options-handlesubmitoptions--event-any--void) returned by [`useFluentForm`](#usefluentform).

#### `resetArray: () => void`

Sets complete form array state to inital state. Initial values can be modified using [`setInitialArray`](#setinitialarray-initialarray-valuestype--void).

## `useFluentFormItem`

### Type

`<Config extends FormArrayConfig>(args: UseFluentFormItemArgs): UseFluentFormItem`

### Description

Hook to create form item.
Expects `UseFluentFormItemArgs`, which is an item of [`formArray`](#formarray-usefluentformitemargs), as parameter.

```tsx
const UserRoleFormArray = () => {
  const { formArray } = useFluentFormArray(arrayConfig);

  return formArray.map(item => <UserRoleForm key={item.key} formItem={item} />);
};
```

```tsx
interface UserRoleFormProps {
  formItem: UseFluentFormItemArgs<typeof arrayConfig>;
}

const UserRoleForm: React.FC<UserRoleFormProps> = ({ formItem }) => {
  const {
    key,
    values,
    touched,
    validity,
    // ...
    handleSubmit,
    reset,
    removeSelf
  } = useFluentFormItem(formItem);

  return (
    <div>
      <label>
        Username:
        <input {...fields.username} />
      </label>
      {/* ... */}
    </div>
  );
};
```

### Return type

Is equal to return type of [`useFluentForm`](#usefluentform), with following additional properties:

#### `key: string | number`

Unique key that is used to identify a form item.

#### `removeSelf: () => void`

Removes itself from the form array.
