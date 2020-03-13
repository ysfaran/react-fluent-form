import { field } from "../src/fields/FieldCreatorInstance";
import { FormArrayConfig } from "../src/form-config/FormArrayConfig";
import { FormArrayConfigHelper } from "../src/form-config/FormArrayConfigHelper";

describe("FormConfigHelper", () => {
  let formArrayConfig: FormArrayConfig;
  let formArrayConfigHelper: FormArrayConfigHelper;

  beforeEach(() => {
    formArrayConfig = new FormArrayConfig({
      username: field.text("user"),
      email: field.email()
    });

    formArrayConfigHelper = new FormArrayConfigHelper(formArrayConfig);
  });

  describe("getInitialArrayValues", () => {
    it("returns empty object when there is no initial array", () => {
      const initialArray = formArrayConfigHelper.getInitialArrayValues();

      expect(initialArray).toEqual({});
    });

    it("returns empty object when initial array is empty", () => {
      formArrayConfig.withInitialArray([]);

      const initialArray = formArrayConfigHelper.getInitialArrayValues();

      expect(initialArray).toEqual({});
    });

    it("extracts initial values from object first", () => {
      const initialArrayActual = [
        { username: "another-user", email: "user@mail.com" },
        { username: "", email: "" }
      ];

      formArrayConfig.withInitialArray(initialArrayActual);

      const initialArray = formArrayConfigHelper.getInitialArrayValues();

      expect(initialArray).toEqual({
        "0": {
          key: 0,
          sortPosition: 0,
          values: { username: "another-user", email: "user@mail.com" },
          touched: {},
          validity: {},
          errors: {},
          submitting: false,
          context: undefined
        },
        "1": {
          key: 1,
          sortPosition: 1,
          values: { username: "", email: "" },
          touched: {},
          validity: {},
          errors: {},
          submitting: false,
          context: undefined
        }
      });
    });

    it("sets key with key generator if it is specified", () => {
      const initialArrayActual = [
        { username: "user0", email: "" },
        { username: "user1", email: "" }
      ];

      formArrayConfig
        .withInitialArray(initialArrayActual)
        .withKeyGenerator(values => values.username);

      const initialArray = formArrayConfigHelper.getInitialArrayValues();

      expect(initialArray).toMatchObject({ user0: {}, user1: {} });
    });
  });
});
