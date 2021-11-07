import * as yup from "yup";

import {
  DefaultError,
  DefaultValidationReturnType,
  ValidateFunction,
  ValidateFunctionArgs,
  ValidateYupSchemaArgs,
  Validations,
} from "../types";
import { isYupSchema } from "../utils/isYupSchema";
import { Validator } from "./Validator";

export class DefaultValidator<
  ValuesType extends object,
  V extends Validations<ValuesType> = Validations<ValuesType>
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

    const schema = schemaOrResult as yup.AnySchema;

    if (isYupSchema(schema)) {
      return this.validateYupSchema({ value, values, schema, context });
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
          err
        );
      }
    }
  }

  public validateField<K extends keyof ValuesType>(
    field: K,
    values: ValuesType,
    context: object = {}
  ): DefaultValidationReturnType<V[K]> | void {
    const validate = this.validations[field];
    const value = values[field];

    if (!validate) return;

    if (typeof validate === "function") {
      return this.validateFunction({
        value,
        values,
        validate: validate as ValidateFunction<ValuesType, K>,
        context,
      });
    } else if (isYupSchema(validate)) {
      return this.validateYupSchema({
        value,
        values,
        schema: validate as yup.AnySchema,
        context,
      });
    } else {
      console.warn(
        `Expected validation of type function or yup.AnySchema, but received type: ${typeof validate})`,
        validate
      );
    }
  }
}
