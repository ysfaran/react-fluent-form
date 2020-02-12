import { Input, SetTouched } from "../../types";
import { Field } from "../Field";

export abstract class InputField<V, P> extends Field<V, P> {
  protected _type?: Input;

  public type(value?: Input) {
    this._type = value;
    return this;
  }

  protected handleBlur = (setTouched: SetTouched) => {
    return () => {
      setTouched();
    };
  };
}
