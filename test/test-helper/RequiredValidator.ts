import { ErrorsType } from "../../src/types";
import { Validator } from "../../src/validation/Validator";

export type RequiredField<T> = {
  [K in keyof T]?: "required";
};

export class RequiredValidator<T extends object> extends Validator<
  T,
  ErrorsType<T, string>
> {
  constructor(private requiredFields: RequiredField<T>) {
    super();
  }

  public validateField<K extends keyof T>(
    field: K,
    values: T
  ): void | "field is required" {
    if (this.requiredFields[field] && !values[field]) {
      return "field is required";
    }
  }
}
