import {
  CheckboxInputType,
  ComponentPropsMapper,
  InputPropsChecked,
  SetValue
} from "../../types";
import { InputField } from "./InputField";

export class CheckboxField extends InputField<boolean, InputPropsChecked> {
  constructor(initialValue = false) {
    // workarround for coverage bug: https://github.com/gotwarlost/istanbul/issues/690#issuecomment-544618903
    super(initialValue) /* istanbul ignore next */;
    this._type = "checkbox";
  }

  public type = (value: CheckboxInputType) => {
    return super.type(value);
  };

  protected handleChange = (setValue: SetValue<boolean>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.checked);
    };
  };

  public mapToComponentProps: ComponentPropsMapper<
    boolean,
    InputPropsChecked
  > = ({ value: checked, setValue, setTouched }) => {
    return {
      type: this._type,
      checked,
      onBlur: this.handleBlur(setTouched),
      onChange: this.handleChange(setValue)
    };
  };
}
