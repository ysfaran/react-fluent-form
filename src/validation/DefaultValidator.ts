import {
  DefaultError,
  DefaultValidationReturnType,
  ValidateFunctionArgs,
  ValidateYupSchemaArgs,
  ValidateZodSchemaArgs,
  Validations,
} from "../types";
import { isYupSchema } from "../utils/isYupSchema";
import { Validator } from "./Validator";
import { isZodSchema } from "../utils/isZodSchema";
import { isValidateFunction } from "../utils/isValidateFunction";

export class DefaultValidator<
  ValuesType extends object,
  V extends Validations<ValuesType> = Validations<ValuesType>,
> extends Validator<ValuesType, DefaultError<ValuesType, V>> {
  protected validations: V;

  constructor(validations: V) {
    super();

    this.validations = validations;
  }

  protected validateFunction<K extends keyof ValuesType, E>({
    value,
    values,
    validate,
    context,
  }: ValidateFunctionArgs<ValuesType, K, E>) {
    const schemaOrResult = validate(value, values, context);

    if (isYupSchema(schemaOrResult)) {
      return this.validateYupSchema({
        value,
        values,
        schema: schemaOrResult,
        context,
      });
    } else if (isZodSchema(schemaOrResult)) {
      return this.validateZodSchema({ value, schema: schemaOrResult });
    } else {
      return schemaOrResult as E | undefined;
    }
  }

  protected validateYupSchema<K extends keyof ValuesType>({
    value,
    values,
    schema,
    context,
  }: ValidateYupSchemaArgs<ValuesType, K>) {
    try {
      schema.validateSync(value, { context: { ...values, ...context } });
    } catch (err: any) {
      if (err.name === "ValidationError") {
        return err.errors;
      } else {
        console.warn(
          "yup validation threw an error which isn't of type ValidationError:",
          err,
        );
      }
    }
  }

  protected validateZodSchema<K extends keyof ValuesType>({
    value,
    schema,
  }: ValidateZodSchemaArgs<ValuesType, K>) {
    const result = schema.safeParse(value);

    if (!result.success) {
      return result.error;
    }
  }

  public validateField<K extends keyof ValuesType>(
    field: K,
    values: ValuesType,
    context: object = {},
  ): DefaultValidationReturnType<V[K]> | void {
    const validate = this.validations[field];
    const value = values[field];

    if (!validate) return;

    if (isValidateFunction(validate)) {
      return this.validateFunction({
        value,
        values,
        validate: validate,
        context,
      });
    } else if (isZodSchema(validate)) {
      return this.validateZodSchema({
        value,
        schema: validate,
      }) as DefaultValidationReturnType<V[K]>; // no idea why this assertion is needed;
    } else if (isYupSchema(validate)) {
      return this.validateYupSchema({
        value,
        values,
        schema: validate,
        context,
      });
    } else {
      console.warn(
        `Expected validation of type function, yup.AnySchema or z.Schema, but received type: ${typeof validate})`,
        validate,
      );
    }
  }
}
