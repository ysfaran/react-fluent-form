import { ComponentPropsMapper, RawProps, SetTouched } from "../types";
import { Field } from "./Field";

export class RawField<V> extends Field<V, RawProps<V>> {
  constructor(initialValue: V) {
    super(initialValue);
  }

  protected handleBlur = (setTouched: SetTouched) => {
    return () => {
      setTouched();
    };
  };

  public mapToComponentProps: ComponentPropsMapper<V, RawProps<V>> = ({
    value,
    setValue,
    setTouched
  }) => ({
    value,
    onBlur: this.handleBlur(setTouched),
    onChange: setValue
  });
}
