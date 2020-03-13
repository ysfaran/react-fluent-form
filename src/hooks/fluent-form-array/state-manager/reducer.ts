import {
  Action,
  ErrorsType,
  FluentFormArrayState,
  FluentFormState,
  FormArrayError,
  FormItem,
  FormKey
} from "../../../types";
import {
  deriveValidityFromErrors,
  generateAllTouchedTrue
} from "../../../utils/stateUtils";

export type FluentFormArrayActionTypes<
  ValuesType extends object,
  K extends keyof ValuesType,
  E extends ErrorsType<ValuesType>
> =
  | Action<
      "ADD_FORM",
      {
        key: FormKey;
        sortPosition: number;
        initialState: FluentFormState<ValuesType, E>;
      }
    >
  | Action<"REMOVE_FORM", { key: FormKey }>
  | Action<"SUBMITTING_ARRAY">
  | Action<"FINISHED_SUBMITTING_ARRAY", { formArrayErrors: FormArrayError<E> }>
  | Action<"SET_VALUES", { key: FormKey; values: Partial<ValuesType> }>
  | Action<
      "SET_SINGLE_VALUE",
      { key: FormKey; field: K; value: ValuesType[K]; touched?: boolean }
    >
  | Action<"SET_SINGLE_TOUCHED", { key: FormKey; field: K; touched?: boolean }>
  | Action<"SET_CONTEXT", { key: FormKey; context: any }>
  | Action<
      "VALUE_CHANGE",
      { key: FormKey; field: K; value: ValuesType[K]; touched?: boolean }
    >
  | Action<"VALIDATION_FAILURE", { key: FormKey; field: K; error: E[K] }>
  | Action<"VALIDATION_SUCCESS", { key: FormKey; field: K }>
  | Action<"SUBMITTING", { key: FormKey }>
  | Action<"FINISHED_SUBMITTING", { key: FormKey; errors: E }>
  | Action<"RESET", FormItem<ValuesType, E>>;

export const fluentFormArrayReducer = <
  ValuesType extends object,
  K extends keyof ValuesType,
  E extends ErrorsType<ValuesType>
>(
  state: FluentFormArrayState<ValuesType, E>,
  action: FluentFormArrayActionTypes<ValuesType, K, E>
): FluentFormArrayState<ValuesType, E> => {
  switch (action.type) {
    case "ADD_FORM": {
      const { key, sortPosition, initialState } = action.payload;

      return {
        ...state,
        formArray: {
          ...state.formArray,
          [key]: {
            key,
            sortPosition,
            ...initialState
          }
        }
      };
    }
    case "REMOVE_FORM": {
      const { key } = action.payload;

      const stateCopy: FluentFormArrayState<ValuesType, E> = {
        ...state,
        formArray: {
          ...state.formArray
        }
      };

      delete stateCopy.formArray[key];

      return stateCopy;
    }
    case "SUBMITTING_ARRAY": {
      return {
        ...state,
        submitting: true
      };
    }
    case "FINISHED_SUBMITTING_ARRAY": {
      const { formArrayErrors } = action.payload;
      const keys = Object.keys(formArrayErrors);

      const stateCopy: FluentFormArrayState<ValuesType, E> = {
        ...state,
        formArray: {
          ...state.formArray
        },
        submitting: false
      };

      for (const key of keys) {
        const formItem = stateCopy.formArray[key];
        const errors = formArrayErrors[key];
        const fields = Object.keys(formItem.values) as Array<keyof ValuesType>;

        const touched = generateAllTouchedTrue(fields);
        const validity = deriveValidityFromErrors(fields, errors);

        stateCopy.formArray[key] = {
          ...stateCopy.formArray[key],
          touched,
          validity,
          errors,
          submitting: false
        };
      }

      return stateCopy;
    }
    case "SET_VALUES": {
      const { key, values } = action.payload;
      const form = state.formArray[key];

      return {
        ...state,
        formArray: {
          ...state.formArray,
          [key]: {
            ...form,
            values: {
              ...form.values,
              ...values
            }
          }
        }
      };
    }
    case "SET_SINGLE_TOUCHED": {
      const { key, field, touched } = action.payload;
      const formItem = state.formArray[key];

      return {
        ...state,
        formArray: {
          ...state.formArray,
          [key]: {
            ...formItem,
            touched: { ...formItem.touched, [field]: touched }
          }
        }
      };
    }
    case "SET_CONTEXT": {
      const { key, context } = action.payload;
      const form = state.formArray[key];

      return {
        ...state,
        formArray: {
          ...state.formArray,
          [key]: {
            ...form,
            context
          }
        }
      };
    }
    case "VALUE_CHANGE": {
      const { key, field, value, touched } = action.payload;
      const form = state.formArray[key];
      return {
        ...state,
        formArray: {
          ...state.formArray,
          [key]: {
            ...form,
            values: { ...form.values, [field]: value },
            touched: { ...form.touched, [field]: touched }
          }
        }
      };
    }
    case "VALIDATION_FAILURE": {
      const { key, field, error } = action.payload;
      const form = state.formArray[key];
      return {
        ...state,
        formArray: {
          ...state.formArray,
          [key]: {
            ...form,
            errors: { ...form.errors, [field]: error },
            validity: { ...form.validity, [field]: false }
          }
        }
      };
    }

    case "VALIDATION_SUCCESS": {
      const { key, field } = action.payload;
      const form = state.formArray[key];
      return {
        ...state,
        formArray: {
          ...state.formArray,
          [key]: {
            ...form,
            errors: { ...form.errors, [field]: undefined },
            validity: { ...form.validity, [field]: true }
          }
        }
      };
    }
    case "SUBMITTING": {
      const { key } = action.payload;
      const form = state.formArray[key];
      return {
        ...state,
        formArray: {
          ...state.formArray,
          [key]: {
            ...form,
            submitting: true
          }
        }
      };
    }
    case "FINISHED_SUBMITTING": {
      const { key, errors } = action.payload;
      const form = state.formArray[key];
      const fields = Object.keys(form.values) as Array<keyof ValuesType>;

      const touched = generateAllTouchedTrue(fields);
      const validity = deriveValidityFromErrors(fields, errors);

      return {
        ...state,
        formArray: {
          ...state.formArray,
          [key]: {
            ...form,
            touched,
            validity,
            errors,
            submitting: false
          }
        }
      };
    }
    case "RESET": {
      const { key } = action.payload;

      return {
        ...state,
        formArray: {
          ...state.formArray,
          [key]: {
            ...action.payload
          }
        }
      };
    }
    default:
      return state;
  }
};
