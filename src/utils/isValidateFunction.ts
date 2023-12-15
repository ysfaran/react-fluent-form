import { ValidateFunction } from "../types";

export function isValidateFunction(
  toCheckObj: any,
): toCheckObj is ValidateFunction<any, any> {
  return typeof toCheckObj === "function";
}
