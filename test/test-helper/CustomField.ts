import { Field } from "../../src/fields/Field";
import { ComponentPropsMapper, InputPropsValue } from "../../src/types";

export class CustomField extends Field<string, InputPropsValue> {
  constructor(initialValue = "") {
    super(initialValue);
  }

  public mapToComponentProps: ComponentPropsMapper<string, InputPropsValue> = ({
    value,
    setValue,
    setTouched
  }) => ({
    value,
    onBlur: () => {
      setTouched();
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setTouched(false);
    }
  });
}
