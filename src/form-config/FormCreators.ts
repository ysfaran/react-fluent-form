import { Fields } from "../types";
import { FormArrayConfig } from "./FormArrayConfig";
import { FormConfig } from "./FormConfig";

export const createForm = <ValuesType extends object = any>() => {
  return <F extends Fields<ValuesType>>(fields: F) =>
    new FormConfig<ValuesType, F>(fields);
};

export const createFormArray = <ValuesType extends object = any>() => {
  return <F extends Fields<ValuesType>>(fields: F) =>
    new FormArrayConfig<ValuesType, F>(fields);
};
