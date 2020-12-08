import {
  ComponentPropsMapper,
  SelectProps,
  SetTouched,
  SetValue,
} from "../types";
import { Field } from "./Field";

export class SelectField extends Field<string, SelectProps> {
  constructor(initialValue = "") {
    super(initialValue);
  }

  protected handleChange = (setValue: SetValue<string>) => {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(e.target.value);
    };
  };

  protected handleBlur = (setTouched: SetTouched) => {
    return () => {
      setTouched();
    };
  };

  public mapToComponentProps: ComponentPropsMapper<string, SelectProps> = ({
    value,
    setValue,
    setTouched,
  }) => ({
    select: {
      value,
      onBlur: this.handleBlur(setTouched),
      onChange: this.handleChange(setValue),
    },
    option: (value: string) => ({
      value,
    }),
  });
}
