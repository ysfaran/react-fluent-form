import { ValidationTrigger } from "../constants/validationTrigger";
import { ComponentPropsMapper } from "../types";

export abstract class Field<ValueType = unknown, ComponentProps = unknown> {
  public _initialValue: ValueType;

  public validationTrigger?: ValidationTrigger;

  constructor(initialValue: ValueType) {
    this._initialValue = initialValue;
  }

  public validateAfterTouchOnChange = () => {
    this.validationTrigger = ValidationTrigger.AfterTouchOnChange;
    return this;
  };

  public validateOnChange = () => {
    this.validationTrigger = ValidationTrigger.OnChange;
    return this;
  };

  public validateOnSubmitOnly = () => {
    this.validationTrigger = ValidationTrigger.OnSubmitOnly;
    return this;
  };

  public abstract mapToComponentProps: ComponentPropsMapper<
    ValueType,
    ComponentProps
  >;
}
