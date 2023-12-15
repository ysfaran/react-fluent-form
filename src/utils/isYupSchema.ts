import * as yup from "yup";

export function isYupSchema(toCheckObj: any): toCheckObj is yup.AnySchema {
  return toCheckObj && toCheckObj.__isYupSchema__;
}
