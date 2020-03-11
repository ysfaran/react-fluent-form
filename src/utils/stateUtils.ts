import { ErrorsType, StateTouched, StateValidity } from "../types";

export function generateAllTouchedTrue<T extends object>(keys: Array<keyof T>) {
  const touched: StateTouched<T> = {};

  for (let i = 0; i < keys.length; i++) {
    touched[keys[i]] = true;
  }

  return touched;
}

export function deriveValidityFromErrors<T extends object>(
  keys: Array<keyof T>,
  errors: ErrorsType<T>
) {
  const validity: StateValidity<T> = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    validity[key] = errors[key] === undefined;
  }

  return validity;
}
