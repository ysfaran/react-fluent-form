import * as yup from "yup";

import { DefaultValidator } from "../src/validation/DefaultValidator";
import { TestModel } from "./types";

describe("DefaultValidator", () => {
  let testModel: TestModel;

  beforeEach(() => {
    testModel = {
      aString: "some-string",
      aDate: new Date(1970, 1, 1)
    };
  });

  it("is able to execute validations for all fields (validateAllFields)", () => {
    const validator = new DefaultValidator<TestModel>({
      aString: yup.mixed(),
      aDate: yup.mixed()
    });

    validator.validateField = jest.fn(() => 1) as any;

    const result = validator.validateAllFields(testModel, "context");

    expect(result).toMatchObject({
      aString: 1,
      aDate: 1
    });
    expect(validator.validateField).toHaveBeenCalledWith(
      "aString",
      testModel,
      "context"
    );
    expect(validator.validateField).toHaveBeenCalledWith(
      "aDate",
      testModel,
      "context"
    );
  });

  describe("validateField", () => {
    it("logs a warning when yup throws an error other than ValidationError", () => {
      const validator = new DefaultValidator<TestModel>({
        aString: yup.string().when("aString", {
          is: () => 1 / 0,
          then: "erro should be thrown before"
        })
      });

      console.warn = jest.fn();

      validator.validateField("aString", testModel);

      expect(console.warn).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Error)
      );
    });

    it("doesn't validate if neither a function or yup schema was provided and logs warning", () => {
      const validator = new DefaultValidator<TestModel>({
        aString: 1 as any
      });

      console.warn = jest.fn();

      const result = validator.validateField("aString", testModel);

      expect(result).not.toBeDefined();
      expect(console.warn).toHaveBeenCalledWith(expect.any(String), 1);
    });

    it("returns undefined when no validation was passed ", () => {
      const validator = new DefaultValidator<TestModel>({});

      const result = validator.validateField("aString", testModel);

      expect(result).not.toBeDefined();
    });

    it("returns result of yup validation properly", () => {
      const validator = new DefaultValidator<TestModel>({
        aString: yup.string().min(20)
      });

      const result = validator.validateField("aString", testModel);

      expect(result).toEqual(expect.any(Array));
    });

    it("returns result of custom validation function", () => {
      const validator = new DefaultValidator<TestModel>({
        aString: () => {
          return 1;
        }
      });

      const result = validator.validateField("aString", testModel);

      expect(result).toBe(1);
    });

    it("allows to return yup validation conditionally", () => {
      const validator = new DefaultValidator<TestModel>({
        aString: (_value, values) => {
          if (values.aDate) {
            return yup.string().min(15, "conditional yup.min(15) error");
          } else {
            return yup.string().min(20, "conditional yup.min(20) error");
          }
        }
      });

      let result = validator.validateField("aString", testModel);

      expect(result).toEqual(["conditional yup.min(15) error"]);

      testModel.aDate = null;
      result = validator.validateField("aString", testModel);

      expect(result).toEqual(["conditional yup.min(20) error"]);
    });

    it("considers context when validating with validation function", () => {
      const validator = new DefaultValidator<TestModel>({
        aString: (_value, _values, context) => {
          if (context.contextValue === 1) {
            return yup.string().min(20);
          }
        }
      });

      let result = validator.validateField("aString", testModel, {
        contextValue: 1
      });

      expect(result).toMatchObject(expect.any(Array));

      result = validator.validateField("aString", testModel, {
        contextValue: 2
      });

      expect(result).not.toBeDefined();
    });

    it("considers context when validating with yup schema", () => {
      const validator = new DefaultValidator<TestModel>({
        aDate: yup.date().when("$contextValue", {
          is: 1,
          then: yup.date().min(new Date(2000, 1, 2))
        })
      });

      let result = validator.validateField("aDate", testModel, {
        contextValue: 1
      });

      expect(result).toEqual(expect.any(Array));

      result = validator.validateField("aDate", testModel, { contextValue: 2 });

      expect(result).not.toBeDefined();
    });

    it("allows using other fields as yup context for validation", () => {
      const validator = new DefaultValidator<TestModel>({
        aDate: yup.date().when("$aString", {
          is: "condition",
          then: yup.date().min(new Date(2000, 1, 1))
        })
      });

      let result = validator.validateField("aDate", testModel);

      expect(result).not.toBeDefined();

      testModel.aString = "condition";
      result = validator.validateField("aDate", testModel);

      expect(result).toEqual(expect.any(Array));
    });
  });
});
