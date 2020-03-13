import { FormArrayConfig } from "../src/form-config/FormArrayConfig";
import { FormConfig } from "../src/form-config/FormConfig";
import {
  FormKey,
  UseFluentForm,
  UseFluentFormArray,
  UseFluentFormItem,
  UseFluentFormItemArgs
} from "../src/types";

// renderWithFluentForm

export type UiComponentProps<C extends FormConfig> = {
  fluentForm: UseFluentForm<C>;
};

export type FluentFormRef<C extends FormConfig> = {
  current: UseFluentForm<C>;
};

// renderWithFluentFormArray

export type UiArrayComponentProps<C extends FormArrayConfig> = {
  fluentFormArray: UseFluentFormArray<C>;
};

export type FluentFormArrayRef<C extends FormArrayConfig> = {
  current: UseFluentFormArray<C>;
};

// renderWithFluentFormItem

export type UiItemComponentProps<C extends FormConfig> = {
  formItem: UseFluentFormItem<C>;
};

export type FluentFormItemsRef<C extends FormConfig> = {
  current: { [key in FormKey]: UseFluentFormItem<C> };
};

export interface FormItemsRefSetterProps<C extends FormArrayConfig> {
  formItemsRef: FluentFormItemsRef<C>;
  formItemArgs: UseFluentFormItemArgs<C>;
  Component: React.FC<UiItemComponentProps<C>>;
}

// model types

export type TestModel = {
  aString: string;
  aDate: Date | null;
};

export type RegisterModel = {
  username: string;
  password: string;
};

export type UserModel = {
  username: string;
  email: string;
};

export type SendEmailModel = {
  sendEmail: boolean;
};

export type NameModel = {
  name: string;
};

export type ColorModel = {
  color: string;
};

export type MultiColorModel = {
  firstColor: string;
  secondColor: string;
};

export type CarModel = {
  brand: string;
};

export type CommentModel = {
  comment: string;
};

export type AgeModel = {
  age: number;
};

export type UsernameModel = {
  username: string;
};
