import { Field } from "../fields/Field";
import { FieldCreator } from "../fields/FieldCreator";

export const addField = <F extends Field<any, any>>(
  fieldName: string,
  fieldCreator: (...args: any[]) => F,
) => {
  (FieldCreator.prototype as any)[fieldName] = fieldCreator;
};
