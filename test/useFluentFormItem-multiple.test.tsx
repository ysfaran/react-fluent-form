import React from "react";
import * as yup from "yup";

import { act, fireEvent } from "@testing-library/react";

import { createFormArray, field } from "../src";
import { FormArrayConfig } from "../src/form-config/FormArrayConfig";
import { renderWithFluentFormItems } from "./test-utils/renderWithFluentItems";
import { RegisterModel, UserModel } from "./types";

function createConfigForTest() {
  return createFormArray<UserModel>()({
    username: field.text(),
    email: field.email()
  }).withValidation({
    email: yup.string().required()
  });
}
function renderFluentFormItemsForTest<
  Config extends FormArrayConfig<UserModel, any, any>
>(config?: Config) {
  const formConfig = config ? config : createConfigForTest();

  const result = renderWithFluentFormItems(
    formConfig,
    ({ formItem: { key, fields, removeSelf } }) => {
      return (
        <>
          <input data-testid={"username" + key} {...fields.username} />
          <input data-testid={"email" + key} {...fields.email} />
          <button data-testid={"remove" + key} onClick={removeSelf}>
            Remove
          </button>
        </>
      );
    }
  );

  act(() => result.fluentFormArrayRef.current.addForm());
  act(() => result.fluentFormArrayRef.current.addForm());
  act(() => result.fluentFormArrayRef.current.addForm());

  return result;
}

describe("useFluentFormItem (multiple)", () => {
  it("adds mutliple form item when calling addForm multiple times", () => {
    const { queryByTestId } = renderFluentFormItemsForTest();

    expect(queryByTestId("username0")).toBeInTheDocument();
    expect(queryByTestId("username1")).toBeInTheDocument();
    expect(queryByTestId("username2")).toBeInTheDocument();
  });

  it("can remove itself without influencing other form items", () => {
    const { getByTestId, fluentFormArrayRef } = renderFluentFormItemsForTest();

    fireEvent.click(getByTestId("remove1"));

    expect(fluentFormArrayRef.current.formStates).toHaveLength(2);
    expect(fluentFormArrayRef.current.formArray).toHaveLength(2);

    expect(fluentFormArrayRef.current.formStates[0].key).toBe(0);
    expect(fluentFormArrayRef.current.formArray[1].key).toBe(2);
  });

  describe("No cross-form-items influence on state updates", () => {
    it("updates values independently", () => {
      const {
        getByTestId,
        fluentFormArrayRef,
        fluentFormItemsRef
      } = renderFluentFormItemsForTest();

      fireEvent.change(getByTestId("username1"), {
        target: { value: "ysfaran" }
      });

      const { current: fluentFormArray } = fluentFormArrayRef;
      const { current: fluentFormItems } = fluentFormItemsRef;

      const formArrayValues0 = fluentFormArray.formStates[0].values;
      const formItemValues0 = fluentFormItems[0].values;
      const formArrayValues1 = fluentFormArray.formStates[1].values;
      const formItemValues1 = fluentFormItems[1].values;
      const formArrayValues2 = fluentFormArray.formStates[2].values;
      const formItemValues2 = fluentFormItems[2].values;

      expect(formArrayValues1).toEqual({
        username: "ysfaran",
        email: ""
      });
      expect(formItemValues1).toEqual(formArrayValues1);

      expect(formArrayValues0).toEqual({
        username: "",
        email: ""
      });
      expect(formItemValues0).toEqual(formArrayValues0);
      expect(formArrayValues2).toEqual(formArrayValues0);
      expect(formItemValues2).toEqual(formArrayValues0);
    });

    it("updates touched independently", () => {
      const {
        getByTestId,
        fluentFormArrayRef,
        fluentFormItemsRef
      } = renderFluentFormItemsForTest();

      fireEvent.blur(getByTestId("username1"));

      const { current: fluentFormArray } = fluentFormArrayRef;
      const { current: fluentFormItems } = fluentFormItemsRef;

      const formArrayTouched0 = fluentFormArray.formStates[0].touched;
      const formItemTouched0 = fluentFormItems[0].touched;
      const formArrayTouched1 = fluentFormArray.formStates[1].touched;
      const formItemTouched1 = fluentFormItems[1].touched;
      const formArrayTouched2 = fluentFormArray.formStates[2].touched;
      const formItemTouched2 = fluentFormItems[2].touched;

      expect(formArrayTouched1).toEqual({ username: true });
      expect(formItemTouched1).toEqual(formArrayTouched1);

      expect(formArrayTouched0).toEqual({});
      expect(formItemTouched0).toEqual(formArrayTouched0);
      expect(formArrayTouched2).toEqual(formArrayTouched0);
      expect(formItemTouched2).toEqual(formArrayTouched0);
    });

    it("it updates validity and errors independently", () => {
      const {
        getByTestId,
        fluentFormArrayRef,
        fluentFormItemsRef
      } = renderFluentFormItemsForTest();

      fireEvent.blur(getByTestId("email1"));

      const { current: fluentFormArray } = fluentFormArrayRef;
      const { current: fluentFormItems } = fluentFormItemsRef;

      const formArrayValidity0 = fluentFormArray.formStates[0].validity;
      const formItemValidity0 = fluentFormItems[0].validity;
      const formArrayValidity1 = fluentFormArray.formStates[1].validity;
      const formItemValidity1 = fluentFormItems[1].validity;
      const formArrayValidity2 = fluentFormArray.formStates[2].validity;
      const formItemValidity2 = fluentFormItems[2].validity;

      const formArrayErrors0 = fluentFormArray.formStates[0].errors;
      const formItemErrors0 = fluentFormItems[0].errors;
      const formArrayErrors1 = fluentFormArray.formStates[1].errors;
      const formItemErrors1 = fluentFormItems[1].errors;
      const formArrayErrors2 = fluentFormArray.formStates[2].errors;
      const formItemErrors2 = fluentFormItems[2].errors;

      expect(formArrayValidity1).toEqual({ email: false });
      expect(formItemValidity1).toEqual(formArrayValidity1);
      expect(formArrayErrors1).toEqual({
        email: expect.any(Array)
      });
      expect(formItemErrors1).toEqual(formArrayErrors1);

      expect(formArrayValidity0).toEqual({});
      expect(formItemValidity0).toEqual(formArrayValidity0);
      expect(formArrayValidity2).toEqual(formArrayValidity0);
      expect(formItemValidity2).toEqual(formArrayValidity0);
      expect(formArrayErrors0).toEqual({});
      expect(formItemErrors0).toEqual(formArrayErrors0);
      expect(formArrayErrors2).toEqual(formArrayErrors0);
      expect(formItemErrors2).toEqual(formArrayErrors0);
    });

    it("resets forms independently", () => {
      const {
        fluentFormArrayRef,
        fluentFormItemsRef,
        getByTestId
      } = renderFluentFormItemsForTest();

      let { current: fluentFormItems } = fluentFormItemsRef;

      let formItem0 = fluentFormItems[0];
      let formItem1 = fluentFormItems[1];
      let formItem2 = fluentFormItems[2];

      fireEvent.blur(getByTestId("email0"));

      fireEvent.blur(getByTestId("email1"));
      fireEvent.blur(getByTestId("username1"));

      fireEvent.blur(getByTestId("email2"));

      formItem0.setInitialValues({
        username: "username0"
      });

      formItem1.setInitialValues({
        email: "email1"
      });

      formItem2.setInitialValues({
        username: "username2",
        email: "email2"
      });

      act(() => {
        formItem0.reset();
        formItem2.reset();
      });

      fluentFormItems = fluentFormItemsRef.current;
      const { current: fluentFormArray } = fluentFormArrayRef;

      formItem0 = fluentFormItems[0];
      formItem1 = fluentFormItems[1];
      formItem2 = fluentFormItems[2];
      const formArrayState0 = fluentFormArray.formStates[0];
      const formArrayState1 = fluentFormArray.formStates[1];
      const formArrayState2 = fluentFormArray.formStates[2];

      expect(formArrayState0).toEqual(
        expect.objectContaining({
          errors: {},
          submitting: false,
          touched: {},
          validity: {},
          values: {
            username: "username0",
            email: ""
          }
        })
      );
      expect(formItem0).toEqual(expect.objectContaining(formArrayState0));

      expect(formArrayState1).toEqual(
        expect.objectContaining({
          errors: { email: expect.any(Array) },
          submitting: false,
          touched: {
            email: true,
            username: true
          },
          validity: {
            email: false,
            username: true
          },
          values: {
            username: "",
            email: ""
          }
        })
      );
      expect(formItem1).toEqual(expect.objectContaining(formArrayState1));

      expect(formArrayState2).toEqual(
        expect.objectContaining({
          errors: {},
          submitting: false,
          touched: {},
          validity: {},
          values: {
            username: "username2",
            email: "email2"
          }
        })
      );
      expect(formItem2).toEqual(expect.objectContaining(formArrayState2));
    });

    it("updates values independently when setting them manually", () => {
      const {
        fluentFormArrayRef,
        fluentFormItemsRef
      } = renderFluentFormItemsForTest();

      act(() => {
        fluentFormItemsRef.current[1].setValues({
          username: "ysfaran",
          email: "test@email.com"
        });
      });

      const { current: fluentFormArray } = fluentFormArrayRef;
      const { current: fluentFormItems } = fluentFormItemsRef;

      const formArrayValues0 = fluentFormArray.formStates[0].values;
      const formItemValues0 = fluentFormItems[0].values;
      const formArrayValues1 = fluentFormArray.formStates[1].values;
      const formItemValues1 = fluentFormItems[1].values;
      const formArrayValues2 = fluentFormArray.formStates[2].values;
      const formItemValues2 = fluentFormItems[2].values;

      expect(formArrayValues1).toEqual({
        username: "ysfaran",
        email: "test@email.com"
      });
      expect(formItemValues1).toEqual(formArrayValues1);

      expect(formArrayValues0).toEqual({
        username: "",
        email: ""
      });
      expect(formItemValues0).toEqual(formArrayValues0);
      expect(formArrayValues2).toEqual(formArrayValues0);
      expect(formItemValues2).toEqual(formArrayValues0);
    });

    it("updates context independently when setting it manually", () => {
      const {
        fluentFormArrayRef,
        fluentFormItemsRef
      } = renderFluentFormItemsForTest();

      act(() =>
        fluentFormItemsRef.current[1].setContext({
          contextValue: 1
        })
      );

      const { current: fluentFormArray } = fluentFormArrayRef;
      const { current: fluentFormItems } = fluentFormItemsRef;

      const formArrayContext0 = fluentFormArray.formStates[0].context;
      const formItemContext0 = fluentFormItems[0].context;
      const formArrayContext1 = fluentFormArray.formStates[1].context;
      const formItemContext1 = fluentFormItems[1].context;
      const formArrayContext2 = fluentFormArray.formStates[2].context;
      const formItemContext2 = fluentFormItems[2].context;

      expect(formArrayContext1).toEqual({
        contextValue: 1
      });
      expect(formItemContext1).toEqual(formArrayContext1);

      expect(formArrayContext0).toEqual(undefined);
      expect(formItemContext0).toEqual(formArrayContext0);
      expect(formArrayContext2).toEqual(formArrayContext0);
      expect(formItemContext2).toEqual(formArrayContext0);
    });

    describe("handleSubmit", () => {
      let successCallbacks: [jest.Mock, jest.Mock, jest.Mock];
      let failureCallbacks: [jest.Mock, jest.Mock, jest.Mock];

      beforeEach(() => {
        successCallbacks = [jest.fn(), jest.fn(), jest.fn()];
        failureCallbacks = [jest.fn(), jest.fn(), jest.fn()];
      });

      function renderFluentFormItemsWithSubmit<
        Config extends FormArrayConfig<RegisterModel, any, any>
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
                  onClick={handleSubmit(
                    successCallbacks[key as number],
                    failureCallbacks[key as number]
                  )}
                >
                  Submit
                </button>
              </>
            );
          }
        );

        act(() => result.fluentFormArrayRef.current.addForm());
        act(() => result.fluentFormArrayRef.current.addForm());
        act(() => result.fluentFormArrayRef.current.addForm());

        return result;
      }

      it("calls only success callback always when no validation is present without triggering callbacks for other form items", () => {
        const formConfig = createFormArray<RegisterModel>()({
          username: field.text("ysfaran"),
          password: field.password("secret")
        });

        const { getByTestId } = renderFluentFormItemsWithSubmit(formConfig);

        act(() => {
          fireEvent.click(getByTestId("submit1"));
        });

        expect(successCallbacks[1]).toHaveBeenCalledTimes(1);
        expect(failureCallbacks[1]).not.toHaveBeenCalled();

        expect(successCallbacks[0]).not.toHaveBeenCalled();
        expect(failureCallbacks[0]).not.toHaveBeenCalled();
        expect(successCallbacks[2]).not.toHaveBeenCalled();
        expect(failureCallbacks[2]).not.toHaveBeenCalled();
      });

      it("calls only failure callback when state is invalid without triggering callbacks for other form items", () => {
        const formConfig = createFormArray<RegisterModel>()({
          username: field.text(),
          password: field.password("secret")
        }).withValidation({
          username: yup.string().required()
        });

        const { getByTestId } = renderFluentFormItemsWithSubmit(formConfig);

        act(() => {
          fireEvent.click(getByTestId("submit1"));
        });

        expect(successCallbacks[1]).not.toHaveBeenCalled();
        expect(failureCallbacks[1]).toHaveBeenCalledTimes(1);

        expect(successCallbacks[0]).not.toHaveBeenCalled();
        expect(failureCallbacks[0]).not.toHaveBeenCalled();
        expect(successCallbacks[2]).not.toHaveBeenCalled();
        expect(failureCallbacks[2]).not.toHaveBeenCalled();
      });

      it("prevents submitting again while other submit process is running without triggering callbacks for other form items", async () => {
        const formConfig = createFormArray<RegisterModel>()({
          username: field.text(),
          password: field.password()
        });

        const { getByTestId } = renderFluentFormItemsWithSubmit(formConfig);

        act(() => {
          fireEvent.click(getByTestId("submit1"));
          fireEvent.click(getByTestId("submit1"));
        });

        expect(successCallbacks[1]).toHaveBeenCalledTimes(1);
        expect(failureCallbacks[1]).not.toHaveBeenCalled();

        expect(successCallbacks[0]).not.toHaveBeenCalled();
        expect(failureCallbacks[0]).not.toHaveBeenCalled();
        expect(successCallbacks[2]).not.toHaveBeenCalled();
        expect(failureCallbacks[2]).not.toHaveBeenCalled();
      });
    });
  });
});
