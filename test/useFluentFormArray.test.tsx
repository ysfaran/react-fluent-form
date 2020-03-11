import * as yup from "yup";

import { act, renderHook } from "@testing-library/react-hooks";

import { field } from "../src/fields/FieldCreatorInstance";
import { createFormArray } from "../src/form-config/FormCreators";
import { useFluentFormArray } from "../src/hooks/fluent-form-array/useFluentFormArray";
import { UserModel } from "./types";

describe("useFluentFormArray", () => {
  it("has no form items and form states initially", () => {
    const formConfig = createFormArray<UserModel>()({
      username: field.text(),
      email: field.email()
    });

    const { result } = renderHook(() => useFluentFormArray(formConfig));

    expect(result.current.formArray).toHaveLength(0);
    expect(result.current.formStates).toHaveLength(0);
  });

  describe("addForm", () => {
    it("can add a form item", async () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text(),
        email: field.email()
      });

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => result.current.addForm());

      expect(result.current.formArray).toHaveLength(1);
      expect(result.current.formStates).toHaveLength(1);
    });

    it("allows to specify key manually", async () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text(),
        email: field.email()
      }).withKeyGenerator(values => values.username);

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => result.current.addForm({ key: "some-custom-key" }));

      expect(result.current.formStates[0].key).toBe("some-custom-key");
    });

    it("increments key by default and skips existing keys", async () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text(),
        email: field.email()
      }).withKeyGenerator(values => values.username);

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => {
        result.current.addForm({ key: 0 });
        result.current.addForm({ key: 2 });
      });

      act(() => {
        result.current.addForm();
        result.current.addForm();
      });

      expect(result.current.formStates.map(state => state.key)).toEqual([
        0,
        2,
        1,
        3
      ]);
    });

    it("it uses key generator to set key value if it is specified", () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text(),
        email: field.email()
      }).withKeyGenerator(values => values.username);

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => {
        result.current.addForm({ initialValues: { username: "user0" } });
        result.current.addForm({ initialValues: { username: "user1" } });
      });

      expect(result.current.formStates[0].key).toBe("user0");
      expect(result.current.formStates[1].key).toBe("user1");
    });

    it("initializes state based on config", () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text("ysfaran"),
        email: field.email()
      })
        .withInitialValues({
          email: "example@email.com"
        })
        .withContext({ contextValue: 0 });

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => result.current.addForm());

      expect(result.current.formStates[0]).toMatchObject({
        values: {
          username: "ysfaran",
          email: "example@email.com"
        },
        touched: {},
        validity: {},
        errors: {},
        context: { contextValue: 0 },
        submitting: false
      });
    });

    it("initializes values while prefering passed initial values", () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text("ysfaran"),
        email: field.email()
      }).withInitialValues({
        email: "example@email.com"
      });

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() =>
        result.current.addForm({
          initialValues: { email: "prefered@email.com" }
        })
      );

      expect(result.current.formStates[0].values).toEqual({
        username: "ysfaran",
        email: "prefered@email.com"
      });
    });

    it("keeps form items in order as they were added", () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text(),
        email: field.email()
      });

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => result.current.addForm({ key: 100 }));
      act(() => result.current.addForm({ key: "z" }));
      act(() => result.current.addForm({ key: 34 }));
      act(() => result.current.addForm({ key: "b" }));

      expect(result.current.formArray.map(item => item.key)).toEqual([
        100,
        "z",
        34,
        "b"
      ]);
      expect(result.current.formStates.map(item => item.key)).toEqual([
        100,
        "z",
        34,
        "b"
      ]);
    });
  });

  describe("removeForm", () => {
    it("can remove a form item", () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text(),
        email: field.email()
      });

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => result.current.addForm());
      act(() => result.current.removeForm(0));

      expect(result.current.formArray).toHaveLength(0);
      expect(result.current.formStates).toHaveLength(0);
    });

    it("keeps order when removing form item", () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text(),
        email: field.email()
      });

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => result.current.addForm({ key: 100 }));
      act(() => result.current.addForm({ key: "z" }));
      act(() => result.current.addForm({ key: 34 }));
      act(() => result.current.addForm({ key: "b" }));

      act(() => result.current.removeForm("z"));

      expect(result.current.formArray.map(item => item.key)).toEqual([
        100,
        34,
        "b"
      ]);
      expect(result.current.formStates.map(item => item.key)).toEqual([
        100,
        34,
        "b"
      ]);
    });

    it("does nothing when removing non-existent key", () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text(),
        email: field.email()
      });

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => result.current.addForm({ key: 100 }));
      act(() => result.current.addForm({ key: 34 }));
      act(() => result.current.addForm({ key: "b" }));

      act(() => result.current.removeForm("non existent key"));

      expect(result.current.formArray.map(item => item.key)).toEqual([
        100,
        34,
        "b"
      ]);
      expect(result.current.formStates.map(item => item.key)).toEqual([
        100,
        34,
        "b"
      ]);
    });
  });

  describe("getFormStateByKey", () => {
    it("returns form state of form item with provided key", () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text(),
        email: field.email()
      });

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => result.current.addForm());
      act(() => result.current.addForm());

      const formsState = result.current.getFormStateByKey(0);
      expect(formsState).toEqual(result.current.formStates[0]);
    });

    it("returns undefined if no form item with provided key was found", () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text(),
        email: field.email()
      });

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => result.current.addForm());

      const formsState = result.current.getFormStateByKey("non existent key");
      expect(formsState).toBeUndefined();
    });
  });

  describe("handleSubmit", () => {
    let success: jest.Mock;
    let failure: jest.Mock;

    beforeEach(() => {
      success = jest.fn();
      failure = jest.fn();
    });
    it("calls success callback when all form items are valid", async () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text("ysfaran"),
        email: field.email()
      }).withValidation({
        username: yup.string().required()
      });

      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => result.current.addForm());
      act(() => result.current.addForm());

      act(() => result.current.handleSubmit(success, failure)());

      expect(success).toHaveBeenCalled();
      expect(failure).not.toHaveBeenCalled();

      expect(result.current.formStates).toEqual([
        {
          values: {
            username: "ysfaran",
            email: ""
          },
          key: 0,
          sortPosition: 0,
          touched: { username: true, email: true },
          validity: { username: true, email: true },
          errors: { username: undefined, email: undefined },
          context: undefined,
          submitting: false
        },
        {
          values: {
            username: "ysfaran",
            email: ""
          },
          key: 1,
          sortPosition: 1,
          touched: { username: true, email: true },
          validity: { username: true, email: true },
          errors: { username: undefined, email: undefined },
          context: undefined,
          submitting: false
        }
      ]);
    });

    it("calls failure callback when form items are invalid", async () => {
      const formConfig = createFormArray<UserModel>()({
        username: field.text(),
        email: field.email()
      }).withValidation({
        username: yup.string().required()
      });
      const failure = jest.fn();
      const { result } = renderHook(() => useFluentFormArray(formConfig));

      act(() => result.current.addForm());
      act(() => result.current.addForm());

      act(() => result.current.handleSubmit(success, failure)());

      expect(success).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalled();
      expect(result.current.formStates).toEqual([
        {
          values: {
            username: "",
            email: ""
          },
          key: 0,
          sortPosition: 0,
          touched: { username: true, email: true },
          validity: { username: false, email: true },
          errors: { username: expect.any(Array), email: undefined },
          context: undefined,
          submitting: false
        },
        {
          values: {
            username: "",
            email: ""
          },
          key: 1,
          sortPosition: 1,
          touched: { username: true, email: true },
          validity: { username: false, email: true },
          errors: { username: expect.any(Array), email: undefined },
          context: undefined,
          submitting: false
        }
      ]);
    });
  });
});
