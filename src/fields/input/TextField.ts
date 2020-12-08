import {
  ComponentPropsMapper,
  InputPropsValue,
  SetValue,
  ValueInputTypes,
} from "../../types";
import { InputField } from "./InputField";

export class TextField extends InputField<string, InputPropsValue> {
  constructor(initialValue = "") {
    // workarround for coverage bug: https://github.com/gotwarlost/istanbul/issues/690#issuecomment-544618903
    super(initialValue) /* istanbul ignore next */;
  }

  public type = (value: ValueInputTypes) => {
    return super.type(value);
  };

  protected handleChange = (setValue: SetValue<string>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };
  };

  public mapToComponentProps: ComponentPropsMapper<string, InputPropsValue> = ({
    value,
    setValue,
    setTouched,
  }) => ({
    type: this._type,
    value,
    onBlur: this.handleBlur(setTouched),
    onChange: this.handleChange(setValue),
  });
}
