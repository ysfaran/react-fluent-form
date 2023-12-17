import React from "react";
import * as yup from "yup";

import { act, fireEvent } from "@testing-library/react";

import { field } from "../src/fields/FieldCreatorInstance";
import { FormArrayConfig } from "../src/form-config/FormArrayConfig";
import { createFormArray } from "../src/form-config/FormCreators";
import { renderWithFluentFormItems } from "./test-utils/renderWithFluentItems";
import { RegisterModel, UserModel } from "./types";
import { ZodError, z } from "zod";

function createConfigForTest() {
  return createFormArray<UserModel>()({
    username: field.text(),
    email: field.email(),
    password: field.password(),
  })
    .withValidation({
      email: yup.string().required(),
      password: z.string().min(1),
    })
    .withInitialArray([{ username: "", email: "", password: "" }]);
}
function renderFluentFormItemsForTest<
  Config extends FormArrayConfig<UserModel, any, any>,
>(config?: Config) {
  const formConfig = config ? config : createConfigForTest();

  const result = renderWithFluentFormItems(
    formConfig,
    ({ formItem: { key, fields, removeSelf } }) => {
      return (
        <>
          <input data-testid={"username" + key} {...fields.username} />
          <input data-testid={"email" + key} {...fields.email} />
          <input data-testid={"password" + key} {...fields.password} />
          <button data-testid={"remove" + key} onClick={removeSelf}>
            Remove
          </button>
        </>
      );
    },
  );

  return result;
}

describe("useFluentFormItem (single)", () => {
  it("adds form item when calling addForm", () => {
    const { queryByTestId, fluentFormArrayRef } =
      renderFluentFormItemsForTest();

    act(() => fluentFormArrayRef.current.addForm());

    expect(queryByTestId("username1")).toBeInTheDocument();
    expect(queryByTestId("email1")).toBeInTheDocument();
  });

  it("can remove itself", () => {
    const { queryByTestId, getByTestId, fluentFormArrayRef } =
      renderFluentFormItemsForTest();

    fireEvent.click(getByTestId("remove0"));

    expect(fluentFormArrayRef.current.formStates).toHaveLength(0);
    expect(fluentFormArrayRef.current.formArray).toHaveLength(0);
    expect(queryByTestId("username0")).not.toBeInTheDocument();
    expect(queryByTestId("email0")).not.toBeInTheDocument();
  });

  describe("single item updates", () => {
    it("updates form array state and form item when updating a value", () => {
      const { getByTestId, fluentFormArrayRef, fluentFormItemsRef } =
        renderFluentFormItemsForTest();

      fireEvent.change(getByTestId("username0"), {
        target: { value: "ysfaran" },
      });

      const formArrayValues = fluentFormArrayRef.current.formStates[0].values;
      const formItemValues = fluentFormItemsRef.current[0].values;

      expect(formArrayValues).toMatchObject({
        username: "ysfaran",
        email: "",
      });
      expect(formItemValues).toMatchObject(formArrayValues);
    });

    it("updates form array state and form item when touching a field", () => {
      const { getByTestId, fluentFormArrayRef, fluentFormItemsRef } =
        renderFluentFormItemsForTest();

      fireEvent.blur(getByTestId("username0"));

      const formArrayTouched = fluentFormArrayRef.current.formStates[0].touched;
      const formItemTouched = fluentFormItemsRef.current[0].touched;

      expect(formArrayTouched).toMatchObject({
        username: true,
      });

      expect(formItemTouched).toMatchObject(formArrayTouched);
    });

    it("updates form array state and form item when validation was triggered", () => {
      const { getByTestId, fluentFormArrayRef, fluentFormItemsRef } =
        renderFluentFormItemsForTest();

      fireEvent.blur(getByTestId("email0"));

      const formArrayValidity =
        fluentFormArrayRef.current.formStates[0].validity;
      const formItemValidity = fluentFormItemsRef.current[0].validity;

      const formArrayErrors = fluentFormArrayRef.current.formStates[0].errors;
      const formItemErrors = fluentFormItemsRef.current[0].errors;

      expect(formArrayValidity).toMatchObject({
        email: false,
      });
      expect(formItemValidity).toMatchObject(formArrayValidity);
      expect(formArrayErrors).toMatchObject({
        email: expect.any(Array),
      });
      expect(formItemErrors).toMatchObject(formArrayErrors);
    });

    it("updates form array state and form item when resetting the form", () => {
      const { getByTestId, fluentFormArrayRef, fluentFormItemsRef } =
        renderFluentFormItemsForTest();

      const userInput = getByTestId("username0");
      const emailInput = getByTestId("email0");

      fireEvent.change(userInput, {
        target: { value: "ysfaran" },
      });

      fireEvent.blur(userInput);
      fireEvent.blur(emailInput);

      const fluentArrayState = fluentFormArrayRef.current.formStates[0];
      expect(fluentArrayState).toMatchObject({
        errors: {
          username: undefined,
          email: expect.any(Array),
        },
        submitting: false,
        touched: {
          username: true,
          email: true,
        },
        validity: {
          username: true,
          email: false,
        },
        values: {
          username: "ysfaran",
          email: "",
        },
      });

      expect(fluentFormItemsRef.current[0]).toMatchObject({
        errors: fluentArrayState.errors,
        submitting: false,
        touched: fluentArrayState.touched,
        validity: fluentArrayState.validity,
        values: fluentArrayState.values,
      });

      act(() =>
        fluentFormItemsRef.current[0].setInitialValues({
          email: "new@inital.com",
        }),
      );

      act(() => fluentFormItemsRef.current[0].reset());

      expect(fluentFormArrayRef.current.formStates[0]).toMatchObject({
        errors: {},
        submitting: false,
        touched: {},
        validity: {},
        values: {
          username: "",
          email: "new@inital.com",
        },
      });
    });

    it("updates form array state and form item based on initial array when resetting the form", () => {
      const arrayConfig = createFormArray<UserModel>()({
        username: field.text(),
        email: field.email(),
        password: field.password(),
      }).withInitialArray([
        { username: "user0", email: "email0", password: "" },
      ]);

      const { fluentFormArrayRef, fluentFormItemsRef, getByTestId } =
        renderFluentFormItemsForTest(arrayConfig);

      const userInput0 = getByTestId(/username/);
      const emailInput0 = getByTestId(/email/);
      const passwordInput0 = getByTestId(/password/);

      fireEvent.change(userInput0, { target: { value: "new user0" } });
      fireEvent.change(emailInput0, { target: { value: "new email0" } });
      fireEvent.change(passwordInput0, { target: { value: "new password0" } });

      act(() => fluentFormItemsRef.current[0].reset());

      const formArrayValues0 = fluentFormArrayRef.current.formStates[0].values;
      const formItemValues0 = fluentFormItemsRef.current[0].values;

      expect(formArrayValues0).toEqual({
        username: "user0",
        email: "email0",
        password: "",
      });
      expect(formItemValues0).toEqual(formArrayValues0);
    });

    it("updates form array state and form item when setting values manually", () => {
      const { fluentFormArrayRef, fluentFormItemsRef, queryByDisplayValue } =
        renderFluentFormItemsForTest();

      act(() =>
        fluentFormItemsRef.current[0].setValues({
          username: "ysfaran",
          email: "manual@email.com",
        }),
      );

      const formArrayValues = fluentFormArrayRef.current.formStates[0].values;
      const formItemValues = fluentFormItemsRef.current[0].values;

      expect(formArrayValues).toMatchObject({
        username: "ysfaran",
        email: "manual@email.com",
      });
      expect(formItemValues).toMatchObject(formArrayValues);
      expect(queryByDisplayValue("ysfaran")).toBeInTheDocument();
      expect(queryByDisplayValue("manual@email.com")).toBeInTheDocument();
    });

    it("updates form array state and form item when validating field manually", () => {
      const config = createConfigForTest().withValidation({
        username: yup.string().required(),
        email: z.string().email(),
      });

      const { fluentFormArrayRef, fluentFormItemsRef } =
        renderFluentFormItemsForTest(config);

      let error;

      act(() => {
        error = fluentFormItemsRef.current[0].validateField("email");
      });

      const formArrayErrors = fluentFormArrayRef.current.formStates[0].errors;
      const formItemErrors = fluentFormItemsRef.current[0].errors;

      expect(error).toEqual(expect.any(ZodError));
      expect(formArrayErrors).toEqual({
        username: undefined,
        email: error,
      });
      expect(formItemErrors).toEqual(formArrayErrors);
    });

    it("updates form array state and form item when validating all fields manually", () => {
      const config = createConfigForTest().withValidation({
        username: yup.string().required(),
        email: z.string().email(),
      });

      const { fluentFormArrayRef, fluentFormItemsRef } =
        renderFluentFormItemsForTest(config);

      let errors;

      act(() => {
        errors = fluentFormItemsRef.current[0].validateAllFields();
      });

      const formArrayErrors = fluentFormArrayRef.current.formStates[0].errors;
      const formItemErrors = fluentFormItemsRef.current[0].errors;

      expect(errors).toEqual({
        username: expect.any(Array),
        email: expect.any(ZodError),
      });
      expect(formArrayErrors).toEqual(errors);
      expect(formItemErrors).toEqual(formArrayErrors);
    });

    it("updates form array state and form item when setting context manually", () => {
      const { fluentFormArrayRef, fluentFormItemsRef } =
        renderFluentFormItemsForTest();

      act(() =>
        fluentFormItemsRef.current[0].setContext({
          contextValue: 1,
        }),
      );

      const formArrayContext = fluentFormArrayRef.current.formStates[0].context;
      const formItemContext = fluentFormItemsRef.current[0].context;

      expect(formArrayContext).toMatchObject({
        contextValue: 1,
      });
      expect(formItemContext).toMatchObject(formArrayContext);
    });

    describe("handleSubmit", () => {
      let success: jest.Mock;
      let failure: jest.Mock;

      beforeEach(() => {
        success = jest.fn();
        failure = jest.fn();
      });

      function renderFluentFormItemsWithSubmit<
        Config extends FormArrayConfig<RegisterModel, any, any>,
      >(formConfig: Config) {
        const result = renderWithFluentFormItems(
          formConfig,
          ({ formItem: { key, fields, handleSubmit } }) => {
            return (
              <>
                <input data-testid={"username" + key} {...fields.username} />
                <input data-testid={"email" + key} {...fields.email} />
                <button
                  data-testid={"submit" + key}
                  onClick={handleSubmit(success, failure)}
                >
                  Submit
                </button>
              </>
            );
          },
        );

        act(() => result.fluentFormArrayRef.current.addForm());

        return result;
      }

      it("calls only success callback always when no validation is present", () => {
        const formConfig = createFormArray<RegisterModel>()({
          username: field.text("ysfaran"),
          password: field.password("secret"),
        });

        const { getByTestId } = renderFluentFormItemsWithSubmit(formConfig);

        act(() => {
          fireEvent.click(getByTestId("submit0"));
        });

        expect(success).toHaveBeenCalledTimes(1);
        expect(failure).not.toHaveBeenCalled();
      });

      it("calls only failure callback when state is invalid", () => {
        const formConfig = createFormArray<RegisterModel>()({
          username: field.text(),
          password: field.password("secret"),
        }).withValidation({
          username: yup.string().required(),
        });

        const { getByTestId } = renderFluentFormItemsWithSubmit(formConfig);

        act(() => {
          fireEvent.click(getByTestId("submit0"));
        });

        expect(success).not.toHaveBeenCalled();
        expect(failure).toHaveBeenCalledTimes(1);
      });

      it("prevents submitting again while other submit process is running", async () => {
        const formConfig = createFormArray<RegisterModel>()({
          username: field.text(),
          password: field.password(),
        });

        const { getByTestId } = renderFluentFormItemsWithSubmit(formConfig);

        act(() => {
          fireEvent.click(getByTestId("submit0"));
          fireEvent.click(getByTestId("submit0"));
        });

        expect(success).toHaveBeenCalledTimes(1);
      });
    });
  });
});
