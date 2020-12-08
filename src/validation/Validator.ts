import { ErrorsType } from "../types";

export abstract class Validator<
  ValuesType extends object,
  Errors extends ErrorsType<ValuesType>
> {
  public abstract validateField<K extends keyof ValuesType>(
    field: K,
    values: ValuesType,
    context: object
  ): Errors[K] | void;

  public validateAllFields(values: ValuesType, context: object): Errors {
    const fields = Object.keys(values) as (keyof ValuesType)[];

    return fields.reduce(
      (errors, field) => ({
        ...errors,
        [field]: this.validateField(field, values, context),
      }),
      {} as Errors
    );
  }
}
