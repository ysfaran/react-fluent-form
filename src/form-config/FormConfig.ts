import { ValidationTrigger } from "../constants/validationTrigger";
import { DefaultError, ErrorsType, Fields, Validations } from "../types";
import { DefaultValidator } from "../validation/DefaultValidator";
import { Validator } from "../validation/Validator";

export class FormConfig<
  ValuesType extends object = any,
  F extends Fields<ValuesType> = Fields<any>,
  E extends ErrorsType<ValuesType> = any
> {
  public _fields: F;
  public _initialValues: Partial<ValuesType> = {};
  public _validator?: Validator<ValuesType, E>;
  public _context?: object;
  public _validationTrigger: ValidationTrigger =
    ValidationTrigger.AfterTouchOnChange;
  public _validateOnContextChange?: boolean;

  constructor(fields: F) {
    this._fields = fields;
  }

  public validateAfterTouchOnChange = () => {
    this._validationTrigger = ValidationTrigger.AfterTouchOnChange;
    return this;
  };

  public validateOnChange = () => {
    this._validationTrigger = ValidationTrigger.OnChange;
    return this;
  };

  public validateOnSubmitOnly = () => {
    this._validationTrigger = ValidationTrigger.OnSubmitOnly;
    return this;
  };

  public validateOnContextChange = (validate = true) => {
    this._validateOnContextChange = validate;
    return this;
  };

  public withInitialValues(values: Partial<ValuesType>) {
    this._initialValues = values;
    return this;
  }

  public withValidation<V extends Validations<ValuesType>>(
    validations: V
  ): this & FormConfig<ValuesType, F, DefaultError<ValuesType, V>> {
    this._validator = new DefaultValidator(validations) as any;
    return this;
  }

  public withCustomValidator<V extends Validator<ValuesType, any>>(
    validator: V
  ): this & FormConfig<ValuesType, F, ErrorsType<ValuesType, any>> {
    this._validator = validator as any;
    // TODO improve return type
    return this as any;
  }

  public withContext(context: object) {
    this._context = context;
    return this;
  }
}
