import { ValidationTrigger } from "../../src/constants/validationTrigger";
import { Field } from "../../src/fields/Field";
import { FormConfig } from "../../src/form-config/FormConfig";

export function setTrigger(
  configOrField: FormConfig | Field<any, any>,
  validationTrigger?: ValidationTrigger
) {
  switch (validationTrigger) {
    case ValidationTrigger.AfterTouchOnChange:
      configOrField.validateAfterTouchOnChange();
      break;
    case ValidationTrigger.OnChange:
      configOrField.validateOnChange();
      break;
    case ValidationTrigger.OnSubmitOnly:
      configOrField.validateOnSubmitOnly();
      break;
  }
}
