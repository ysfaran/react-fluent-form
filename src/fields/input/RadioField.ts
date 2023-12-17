import {
  ComponentPropsMapper,
  InputPropsRadioGenerator,
  RadioInputType,
  SetValue,
} from "../../types";
import { InputField } from "./InputField";

export class RadioField extends InputField<string, InputPropsRadioGenerator> {
  private _name?: string;
  private _unselectable?: boolean;

  constructor(initialValue = "") {
    // workarround for coverage bug: https://github.com/gotwarlost/istanbul/issues/690#issuecomment-544618903
    super(initialValue) /* istanbul ignore next */;
    this._type = "radio";
  }

  public name = (value: string) => {
    this._name = value;
    return this;
  };

  public unselectable = (value = true) => {
    this._unselectable = value;
    return this;
  };

  public type = (value: RadioInputType) => {
    return super.type(value);
  };

  protected handleClick = (setValue: SetValue<string>, value: string) => {
    return (e: React.MouseEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value;
      if (this._unselectable && newValue === value) {
        setValue("");
      }
    };
  };

  protected handleChange = (setValue: SetValue<string>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };
  };

  public mapToComponentProps: ComponentPropsMapper<
    string,
    InputPropsRadioGenerator
  > =
    ({ value, setValue, setTouched }) =>
    (radioInputValue: string) => ({
      type: this._type,
      checked: radioInputValue === value,
      name: this._name,
      value: radioInputValue,
      onBlur: this.handleBlur(setTouched),
      onChange: this.handleChange(setValue),
      onClick: this.handleClick(setValue, value),
    });
}
