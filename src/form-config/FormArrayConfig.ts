import { ErrorsType, Fields, KeyGenerator } from "../types";
import { FormConfig } from "./FormConfig";

export class FormArrayConfig<
  ValuesType extends object = any,
  F extends Fields<ValuesType> = Fields<any>,
  E extends ErrorsType<ValuesType> = any
> extends FormConfig<ValuesType, F, E> {
  public _initialArray: ValuesType[] = [];
  public _generateKey?: KeyGenerator<ValuesType>;

  public withInitialArray = (initialArray: ValuesType[]) => {
    this._initialArray = initialArray;
    return this;
  };

  public withKeyGenerator = (keyGenerator: KeyGenerator<ValuesType>) => {
    this._generateKey = keyGenerator;
    return this;
  };
}
