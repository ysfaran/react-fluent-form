<p align="center">
  <img src="https://user-images.githubusercontent.com/13695230/73637822-6cdaa400-4669-11ea-9b3a-20ca73b2358e.png" width="150" height="150" alt="react-fluent-form-logo" />
</p>

<h1 align="center">
  react-fluent-form
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/react-fluent-form">
    <img src="https://img.shields.io/npm/v/react-fluent-form.svg" alt="Current Release" />
  </a>

  <a href="https://travis-ci.org/ysfaran/react-fluent-form">
    <img src="https://travis-ci.org/ysfaran/react-fluent-form.svg?branch=master" alt="Build Status"/>
  </a>

  <a href="https://coveralls.io/github/ysfaran/react-fluent-form?branch=master">
    <img src="https://coveralls.io/repos/github/ysfaran/react-fluent-form/badge.svg?branch=master" alt="Coverage Status" />
  </a>

  <a href="https://github.com/ysfaran/react-fluent-form/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/ysfaran/react-fluent-form.svg" alt="Licence">
  </a>
</p>

This library was heavily inspired by [useFormState](https://www.npmjs.com/package/react-use-form-state) and [Formik](https://www.npmjs.com/package/formik), which are great libraries on their own! `react-fluent-form` aimes to provide a different API and additional features.

Check out the full API [here](docs/API.md). It's written for typescript!

# Core Features

- **Form state handling**: Storing field values and validation state
- **Fluent API**: Configure forms with fluent API syntax
- **Integrated [yup](https://www.npmjs.com/package/yup) validation**: Create validation schemes fluently
- **HTML support**: Support for all reasonable HTML `input` types, `textarea` and `select`
- **Customizable**: Add custom fields, also from third party libraries like [react-select](https://www.npmjs.com/package/react-select) or attach a self-implemented validator

# Installation & Prerequisites

This library supports react hooks only, so react `v16.8` or greater is required.

```bash
npm i react-fluent-form
```

# Basic Usage

Following is a simple example for a registration form containing a username, gender and password field:

```jsx
import { createForm, field, useFluentForm } from "react-fluent-form";

const formConfig = createForm()({
  username: field.text(),
  gender: field.radio("gender").unselectable(), // allows to select nothing
  password: field.password().validateOnSubmitOnly()
});

function RegistrationForm() {
  const { values, fields, handleSubmit } = useFluentForm(formConfig);

  const handleSubmitSuccess = () => console.log(values);

  return (
    <form onSubmit={handleSubmit(handleSubmitSuccess)}>
      <label>
        Username*:
        <input {...fields.username} />
      </label>
      <div>
        Gender:
        <label>
          male
          <input {...fields.radio("male")} />
        </label>
        <label>
          female
          <input {...fields.radio("female")} />
        </label>
      </div>
      <label>
        Password*:
        <input {...fields.password} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

# Validation

Using `withValidation` either a `yup.Schema` or a `validate function` can be provided for each field. Providing a `yup.Schema` will result in a `string[]` error type. In contrast to that you can return any type of data when using `validate function`'s:

```jsx
formConfig.withValidation({
  username: yup.string().required(),
  password: value => {
    if (value.length < 8) {
      // return *any* custom error here (e.g. also complex objects or numbers)
      return "Password is too short";
    }
  }
});

function RegistrationForm() {
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
    <form onSubmit={handleSubmit(handleSubmitSuccess, handleSubmitFailure)}>
      <label>
        Username*:
        <input {...fields.username} />
        {touched.username && !validity.username && (
          <div>{errors.username[0]}</div>
        )}
      </label>
      <label>
        Password*:
        <input {...fields.password} />
        {/* validity.password stays undefined until the submission (validateOnSubmitOnly) */}
        {touched.password && validity.password === false && <div>{errors.password[0]}</div>}
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Validation context

In some cases it's required to work with values outside of your form.
This is where `validation context` comes into place.

### Initial context

```jsx
formConfig.withContext({
  // It's recommend to wrap your context values in a "context" field (s. "Conditional validation" section below)
  context: {
    x: 1,
    y: 2
  }
});
```

### Setting context dynamically

If you want to update your context as soon as your context values have changed, you can take advandage of `useEffect`:

```jsx
const { setContext } = useFluentForm(formConfing);

useEffect(() => {
  setContext({ context: coordinates });
}, [coordinates]);
```

### Triggering validation

You can trigger validation of all fields on context changes:

```jsx
formConfig.validateOnContextChange();
```

### Accessing context

```jsx
formConfig.withValidation({
  username: yup.string().when("$context.x", {
    is: 0,
    then: yup.string().required()
  }),
  password: (value, values, { context }) => {
    if (context.x < context.y) return "error";
  }
});
```

## Conditional validation

Often it's necessary to adapt validations for a field based on the values of other fields in your form (and also the context). This can be done via `yup.Schema`'s or via `validate function`'s.  
It's very important to note that `validate function`'s can also return `yup.Schema`'s conditionally. The returned `yup.Schema` will not be treated as an error type, it will be evaluated, thus the error type will be `string[]`.

> **IMPORTANT:**  
> When using `yup.Schema`'s other form fields need to be accessed with a leading `$` (here `$lastName`) which usually means the value is comming from the context. In fact other form values are passed as context to the `yup.Schema` instances for each field during validation execution.  
> To clearly seperate context values from field values it's recommened to wrap actual context values in a `context` field (as mentioned in [Initial context](#validation-context))

```jsx
formConfig.withValidation({
  username: yup.string().required(),
  firstName: yup.string().when("$lastName", {
    is: "",
    otherwise: yup.string().required()
  }),
  lastName: yup.string(),
  password: (value, values) => {
    if (value.includes(values.username)) {
      return "Password should not contain username";
    } else {
      // the error type will be string[] here
      return yup
        .string()
        .required()
        .matches(/[a-zA-Z]/, "Password can only contain letters.");
    }
  }
});
```

# Customization

When working with forms HTML elements are seldom enough to create beatufil and intuitive UI's.
That's why `react-fluent-form` was build to be customizable, so custom field types can be added.
In some cases it's enought to use `field.raw` (s. below).

If you maybe have your own validation library or you just don't like `yup`, also a custom validator can be provided.

## Using the raw field

For components like [react-datepicker](https://www.npmjs.com/package/react-datepicker) it's not necessary to implement a custom field.
`react-fluent-form` comes with a raw field type which works for components with following characteristics:

- it has `value` and a `onChange` prop
- `value` has the same type as the first parameter of `onChange` handler
- it optionally has a `onBlur` prop to indicate when the field is touched

For raw fields it's required to pass an initial value:

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

## Adding custom fields

First of all a new class needs to be implemented which extends `Fields`, the base class of every field. It's required to implement a function called `mapToComponentProps` which receives a parameter with following properties:

- `value: ValueType`: the current value stored in state of `useFluentForm`. Map this to the value prop of your component.
- `setValue(v: ValueType)`: whenever your component changed its value, this function should be called (often it's an `onChange`-like event)
- `setTouched(value: boolean = true)`: call this function when your component has been touched. For most cases this function should be called when the `onBlur` event was triggered.

Imagine you have implemented a custom input field that has an additional prop called `onClear` which is called when the input should be cleared. On top of that you have an option to disable this functionality using the `clearable` prop:

```js
import { Field } from "react-fluent-form";

export class ClearableTextField extends Field {
  constructor(initialValue = "") {
    super(initialValue);
    this.clearable = true;
  }

  // add functions to configure your field
  // NOTE: configuration functions should always return "this" to stay conform to the fluent API syntax
  isClearable = (value = true) => {
    this.clearable = value;
    return this;
  };

  mapToComponentProps = ({ value, setValue, setTouched }) => ({
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

For convenience purposes there is also a utility function named `addField` that adds a custom field to the `field` instance exported by `react-fluent-form` (which is actually adding a new function to `FieldCreator.prototype`). `addField` should be called in a top level file:

```js
import { addField } from "react-fluent-form";

addField("clearableText", intialValue => new ClearableTextField(initialValue));
```

The newly added field can then be used e.g. like so:

```jsx
const formConfig = createForm()({
  username: field.clearableText("initial value").isClearable(false)
});
```

## Adding custom validator

To add a custom validator a class need to be implemented which extends `Validator`. The only function that needs to be implemented is `validateField`, which is called with following parameters:

- `field: KeyType`: name of the field that should be validated
- `values: ValuesType`: current values of the form
- `context: object`: current context value

For the sake of simplicity lets assume you just want to have an optional required check on your fields. An implementation could look like following:

```js
import { Validator } from "react-fluent-form";

export class RequiredValidator extends Validator {
  constructor(requiredFields) {
    super();
    this.requiredFields = requiredFields;
  }

  public validateField(
    field,
    values,
    _context // not relevant for this example
  ) {
    if (this.requiredFields[field] && !values[field]) {
      return "field is required";
    }
  }
}
```

Using `withCustomValidator` a custom validator can be added to your form config:

> **NOTE:** Attaching a custom validator will remove the `DefaultValidator`.

```js
const formConfig = createForm()({
  username: field.text(),
  email: field.email(),
  phone: field.tel()
}).withCustomValidator(new RequiredValidator({
  username: true,
  email: true
});
```

_Not enough details?_ Check out the full API [here](docs/API.md). It's written for typescript!
