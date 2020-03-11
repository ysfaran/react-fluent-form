import { ValueInputTypes } from "../types";
import { CheckboxField } from "./input/CheckboxField";
import { RadioField } from "./input/RadioField";
import { TextField } from "./input/TextField";
import { RawField } from "./RawField";
import { SelectField } from "./SelectField";
import { TextAreaField } from "./TextAreaField";

export class FieldCreator {
  private inputWithValueType = (type: ValueInputTypes) => {
    return (initialValue?: string) => new TextField(initialValue).type(type);
  };

  public checkbox = (initialChecked?: boolean) =>
    new CheckboxField(initialChecked);
  public color = this.inputWithValueType("color");
  public date = this.inputWithValueType("date");
  public datetimeLocal = this.inputWithValueType("datetime-local");
  public email = this.inputWithValueType("email");
  public image = this.inputWithValueType("image");
  public month = this.inputWithValueType("month");
  public number = this.inputWithValueType("number");
  public password = this.inputWithValueType("password");
  public radio = (initialValue?: string) => new RadioField(initialValue);
  public range = this.inputWithValueType("range");
  public search = this.inputWithValueType("search");
  public tel = this.inputWithValueType("tel");
  public text = this.inputWithValueType("text");
  public time = this.inputWithValueType("time");
  public url = this.inputWithValueType("url");
  public week = this.inputWithValueType("week");

  public textarea = (initialValue?: string) => new TextAreaField(initialValue);
  public select = (initialValue?: string) => new SelectField(initialValue);
  public raw = <V>(initialValue: V) => new RawField(initialValue);
}
