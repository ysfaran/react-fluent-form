import { Action, ErrorsType, FluentFormState } from "../../../types";
import {
  deriveValidityFromErrors,
  generateAllTouchedTrue
} from "../../../utils/stateUtils";

export type FluentFormActionTypes<
  ValuesType extends object,
  K extends keyof ValuesType,
  E extends ErrorsType<ValuesType>
> =
  | Action<"SET_VALUES", { values: Partial<ValuesType> }>
  | Action<
      "SET_SINGLE_VALUE",
      { field: K; value: ValuesType[K]; touched?: boolean }
    >
  | Action<"SET_SINGLE_TOUCHED", { field: K; touched?: boolean }>
  | Action<"SET_CONTEXT", { context: any }>
  | Action<
      "VALUE_CHANGE",
      { field: K; value: ValuesType[K]; touched?: boolean }
    >
  | Action<"VALIDATION_FAILURE", { field: K; error: E[K] }>
  | Action<"VALIDATION_SUCCESS", { field: K }>
  | Action<"SUBMITTING">
  | Action<"FINISHED_SUBMITTING", { errors: E }>
  | Action<"RESET", FluentFormState<ValuesType, E>>;

export const fluentFormReducer = <
  ValuesType extends object,
  K extends keyof ValuesType,
  E extends ErrorsType<ValuesType>
>(
  state: FluentFormState<ValuesType, E>,
  action: FluentFormActionTypes<ValuesType, K, E>
): FluentFormState<ValuesType, E> => {
  switch (action.type) {
    case "SET_VALUES":
      return {
        ...state,
        values: { ...state.values, ...action.payload.values }
      };
    case "SET_SINGLE_TOUCHED": {
      const { field, touched } = action.payload;
      return {
        ...state,
        touched: { ...state.touched, [field]: touched }
      };
    }
    case "SET_CONTEXT": {
      const { context } = action.payload;
      return {
        ...state,
        context
      };
    }
    case "VALUE_CHANGE": {
      const { field, value, touched } = action.payload;
      return {
        ...state,
        values: { ...state.values, [field]: value },
        touched: { ...state.touched, [field]: touched }
      };
    }
    case "VALIDATION_FAILURE": {
      const { field, error } = action.payload;
      return {
        ...state,
        errors: { ...state.errors, [field]: error },
        validity: { ...state.validity, [field]: false }
      };
    }

    case "VALIDATION_SUCCESS": {
      const { field } = action.payload;
      return {
        ...state,
        errors: { ...state.errors, [field]: undefined },
        validity: { ...state.validity, [field]: true }
      };
    }
    case "SUBMITTING": {
      return { ...state, submitting: true };
    }
    case "FINISHED_SUBMITTING": {
      const { errors } = action.payload;
      const fields = Object.keys(state.values) as Array<keyof ValuesType>;

      const touched = generateAllTouchedTrue(fields);
      const validity = deriveValidityFromErrors(fields, errors);

      return { ...state, touched, validity, errors, submitting: false };
    }
    case "RESET": {
      return { ...action.payload };
    }
    default:
      return state;
  }
};
