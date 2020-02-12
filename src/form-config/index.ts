import { Fields } from "../types";
import { FormConfig } from "./FormConfig";

export const createForm = <ValuesType extends object = any>() => {
  return <F extends Fields<ValuesType>>(fields: F) =>
    new FormConfig<ValuesType, F>(fields);
};

export * from "./FormConfig";
export * from "./FormConfigHelper";
