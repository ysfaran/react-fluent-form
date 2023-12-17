import { ComponentPropsMapper, RawProps, SetTouched } from "../types";
import { Field } from "./Field";

export class RawField<
  V,
  ValueName extends string = "value",
  OnChangeName extends string = "onChange",
  OnBlurName extends string = "onBlur",
> extends Field<V, RawProps<V, ValueName, OnChangeName, OnBlurName>> {
  protected valueProp = "value";
  protected onChangeProp = "onChange";
  protected onBlurProp = "onBlur";

  constructor(initialValue: V) {
    super(initialValue);
  }

  protected handleBlur = (setTouched: SetTouched) => {
    return () => {
      setTouched();
    };
  };

  public mapToComponentProps: ComponentPropsMapper<
    V,
    RawProps<V, ValueName, OnChangeName, OnBlurName>
  > = ({ value, setValue, setTouched }) =>
    ({
      [this.valueProp]: value,
      [this.onBlurProp]: this.handleBlur(setTouched),
      [this.onChangeProp]: setValue,
    }) as RawProps<V, ValueName, OnChangeName, OnBlurName>;

  public withValueProp = <NewValueName extends string>(
    valueProp: NewValueName,
  ) => {
    this.valueProp = valueProp;
    return this as any as RawField<V, NewValueName, OnChangeName, OnBlurName>;
  };

  public withOnChangeProp = <NewOnChangeName extends string>(
    onChangeProp: NewOnChangeName,
  ) => {
    this.onChangeProp = onChangeProp;
    return this as any as RawField<V, ValueName, NewOnChangeName, OnBlurName>;
  };

  public withOnBlurProp = <NewOnBlurName extends string>(
    onBlurProp: NewOnBlurName,
  ) => {
    this.onBlurProp = onBlurProp;
    return this as any as RawField<V, ValueName, OnChangeName, NewOnBlurName>;
  };
}
