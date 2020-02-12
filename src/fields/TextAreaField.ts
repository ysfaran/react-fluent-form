import {
  ComponentPropsMapper,
  SetTouched,
  SetValue,
  TextAreaProps
} from "../types";
import { Field } from "./Field";

export class TextAreaField extends Field<string, TextAreaProps> {
  constructor(initialValue = "") {
    super(initialValue);
  }

  protected handleChange = (setValue: SetValue<string>) => {
    return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    };
  };

  protected handleBlur = (setTouched: SetTouched) => {
    return () => {
      setTouched();
    };
  };

  public mapToComponentProps: ComponentPropsMapper<string, TextAreaProps> = ({
    value,
    setValue,
    setTouched
  }) => ({
    value,
    onBlur: this.handleBlur(setTouched),
    onChange: this.handleChange(setValue)
  });
}
