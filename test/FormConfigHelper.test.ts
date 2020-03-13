import { ValidationTrigger } from "../src/constants/validationTrigger";
import { field } from "../src/fields/FieldCreatorInstance";
import { FormConfig } from "../src/form-config/FormConfig";
import { FormConfigHelper } from "../src/form-config/FormConfigHelper";
import { setTrigger } from "./test-utils/setTrigger";

const { AfterTouchOnChange, OnChange, OnSubmitOnly } = ValidationTrigger;

describe("FormConfigHelper", () => {
  describe("getInitialValues", () => {
    let formConfig: FormConfig;
    let formConfigHelper: FormConfigHelper;

    beforeEach(() => {
      formConfig = new FormConfig({
        username: field.text("user"),
        email: field.email(),
        age: field.number("30")
      });

      formConfigHelper = new FormConfigHelper(formConfig);
    });

    it("extracts initial values from fields", () => {
      const initialValues = formConfigHelper.getInitialValues();

      expect(initialValues).toMatchObject({
        username: "user",
        email: "",
        age: "30"
      });
    });

    it("extracts initial values from object first", () => {
      formConfig.withInitialValues({
        username: "another-user",
        email: "user@mail.com",
        age: "25"
      });

      const initialValues = formConfigHelper.getInitialValues();

      expect(initialValues).toMatchObject({
        username: "another-user",
        email: "user@mail.com",
        age: "25"
      });
    });

    it("fallbacks to initial values from fields if no value was provided from object", () => {
      formConfig.withInitialValues({
        age: "25"
      });

      const initialValues = formConfigHelper.getInitialValues();

      expect(initialValues).toMatchObject({
        username: "user",
        email: "",
        age: "25"
      });
    });
  });

  describe("shouldValidateOnChange", () => {
    let formConfig: FormConfig;
    let helper: FormConfigHelper<typeof formConfig>;

    beforeEach(() => {
      formConfig = new FormConfig({
        username: field.text(""),
        email: field.text("")
      });

      helper = new FormConfigHelper(formConfig);
    });

    it("returns false by default when not touched", () => {
      expect(helper.shouldValidateOnChange("username", true)).toBeTruthy();
      expect(helper.shouldValidateOnChange("username", false)).toBeFalsy();
      expect(helper.shouldValidateOnChange("username", undefined)).toBeFalsy();
    });

    it("uses global trigger for fields with no trigger", () => {
      formConfig._fields.username.validateOnSubmitOnly();

      expect(helper.shouldValidateOnChange("username", true)).toBeFalsy();
      expect(helper.shouldValidateOnChange("email", true)).toBeTruthy();
    });

    test.each<
      [
        ValidationTrigger,
        ValidationTrigger | undefined,
        boolean | undefined,
        boolean
      ]
    >([
      [AfterTouchOnChange, OnChange, true, true],
      [AfterTouchOnChange, OnChange, false, true],
      [AfterTouchOnChange, OnChange, undefined, true],
      [OnChange, undefined, false, true],
      [OnChange, OnSubmitOnly, true, false],
      [OnSubmitOnly, AfterTouchOnChange, true, true]
    ])(
      'with global trigger "%p", field trigger "%p" and touched "%p" it returns "%p"',
      (
        globalTrigger: ValidationTrigger,
        fieldTrigger: ValidationTrigger | undefined,
        touched: boolean | undefined,
        result: boolean
      ) => {
        setTrigger(formConfig, globalTrigger);
        setTrigger(formConfig._fields.username, fieldTrigger);

        expect(helper.shouldValidateOnChange("username", touched)).toBe(result);
      }
    );
  });

  describe("shouldValidateOnBlur", () => {
    let formConfig: FormConfig;
    let helper: FormConfigHelper<typeof formConfig>;

    beforeEach(() => {
      formConfig = new FormConfig({
        username: field.text(""),
        email: field.text("")
      });

      helper = new FormConfigHelper(formConfig);
    });

    it("returns true by default when touched right now", () => {
      expect(helper.shouldValidateOnBlur("username", true)).toBeTruthy();
      expect(helper.shouldValidateOnBlur("username", false)).toBeFalsy();
    });

    it("uses global trigger for fields with no trigger", () => {
      formConfig._fields.username.validateOnSubmitOnly();

      expect(helper.shouldValidateOnBlur("username", true)).toBeFalsy();
      expect(helper.shouldValidateOnBlur("email", true)).toBeTruthy();
    });

    test.each<
      [ValidationTrigger, ValidationTrigger | undefined, boolean, boolean]
    >([
      [OnChange, AfterTouchOnChange, true, true],
      [OnChange, AfterTouchOnChange, false, false],
      [AfterTouchOnChange, undefined, true, true],
      [AfterTouchOnChange, undefined, false, false],
      [AfterTouchOnChange, OnChange, true, false],
      [AfterTouchOnChange, OnSubmitOnly, true, false]
    ])(
      'with global trigger "%p", field trigger "%p" and touched "%p" it returns "%p"',
      (
        globalTrigger: ValidationTrigger,
        fieldTrigger: ValidationTrigger | undefined,
        touched: boolean,
        result: boolean
      ) => {
        setTrigger(formConfig, globalTrigger);
        setTrigger(formConfig._fields.username, fieldTrigger);

        expect(helper.shouldValidateOnBlur("username", touched)).toBe(result);
      }
    );
  });
});
