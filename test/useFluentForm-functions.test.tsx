import React from "react";
import * as yup from "yup";

import { act, fireEvent } from "@testing-library/react";
import { act as actHooks, renderHook } from "@testing-library/react-hooks";

import { field } from "../src/fields/FieldCreatorInstance";
import { createForm } from "../src/form-config/FormCreators";
import { useFluentForm } from "../src/hooks/fluent-form/useFluentForm";
import { renderWithFluentForm } from "./test-utils/renderWithFluentForm";
import { RegisterModel, UserModel } from "./types";

describe("useFluentForm (functions)", () => {
  it("allows setting values manually", () => {
    const formConfig = createForm<UserModel>()({
      username: field.text(),
      email: field.email()
    });

    const { fluentFormRef, getByDisplayValue } = renderWithFluentForm(
      formConfig,
      ({ fluentForm }) => (
        <>
          <input {...fluentForm.fields.username} />
          <input {...fluentForm.fields.email} />
        </>
      )
    );

    act(() => {
      fluentFormRef.current.setValues({
        username: "ysfaran",
        email: "email@example.com"
      });
    });

    expect(fluentFormRef.current.values).toMatchObject({
      username: "ysfaran",
      email: "email@example.com"
    });

    expect(getByDisplayValue("ysfaran")).toBeInTheDocument();
    expect(getByDisplayValue("email@example.com")).toBeInTheDocument();
  });

  describe("setContext", () => {
    it("does not trigger validation by default", () => {
      const formConfig = createForm<UserModel>()({
        username: field.text(),
        email: field.email()
      })
        .withValidation({
          email: (_value, _values, context) =>
            context.emailRequired
              ? yup
                  .string()
                  .email()
                  .required()
              : yup.string().email()
        })
        .validateOnContextChange(false); // for 100% coverage

      const { result } = renderHook(() => useFluentForm(formConfig));

      actHooks(() => {
        result.current.setContext({ emailRequired: true });
      });

      expect(result.current.context).toMatchObject({
        emailRequired: true
      });

      expect(result.current.errors.email).not.toBeDefined();
    });

    it("does trigger validation if config option is enable", () => {
      const formConfig = createForm<UserModel>()({
        username: field.text(),
        email: field.email()
      })
        .withValidation({
          email: (_value, _values, context) =>
            context.emailRequired
              ? yup
                  .string()
                  .email()
                  .required()
              : yup.string().email()
        })
        .validateOnContextChange();

      const { result } = renderHook(() => useFluentForm(formConfig));

      actHooks(() => {
        result.current.setContext({ emailRequired: true });
      });

      expect(result.current.context).toMatchObject({
        emailRequired: true
      });

      expect(result.current.errors.email).toEqual(expect.any(Array));
    });
  });

  describe("handleSubmit", () => {
    let success: jest.Mock;
    let failure: jest.Mock;

    beforeEach(() => {
      success = jest.fn();
      failure = jest.fn();
    });

    it("calls stopPropagation and preventDefault function of event by default", () => {
      const formConfig = createForm<RegisterModel>()({
        username: field.text("ysfaran"),
        password: field.password("secret")
      });

      const { result } = renderHook(() => useFluentForm(formConfig));

      const simpleEvent = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn()
      };

      actHooks(() => {
        result.current.handleSubmit()(simpleEvent);
      });

      expect(simpleEvent.stopPropagation).toHaveBeenCalled();
      expect(simpleEvent.preventDefault).toHaveBeenCalled();
    });

    it("allows disabling of stopPropagation and preventDefault", () => {
      const formConfig = createForm<RegisterModel>()({
        username: field.text("ysfaran"),
        password: field.password("secret")
      });

      const { result } = renderHook(() => useFluentForm(formConfig));

      const simpleEvent = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn()
      };

      actHooks(() => {
        result.current.handleSubmit(undefined, undefined, {
          preventDefault: false,
          stopPropagation: false
        })(simpleEvent);
      });

      expect(simpleEvent.stopPropagation).not.toHaveBeenCalled();
      expect(simpleEvent.preventDefault).not.toHaveBeenCalled();
    });

    it("does not crash with argument that is not an object/event", () => {
      const formConfig = createForm<RegisterModel>()({
        username: field.text("ysfaran"),
        password: field.password("secret")
      });

      const { result } = renderHook(() => useFluentForm(formConfig));

      actHooks(() => {
        result.current.handleSubmit()(1);
      });
    });

    it("calls only success callback always when no validation is present", () => {
      const formConfig = createForm<RegisterModel>()({
        username: field.text("ysfaran"),
        password: field.password("secret")
      });

      const { container } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <form onSubmit={fluentForm.handleSubmit(success, failure)}>
            <button type="submit">Submit</button>
          </form>
        )
      );

      act(() => {
        fireEvent.click(container.querySelector("button")!);
      });

      expect(success).toHaveBeenCalledTimes(1);
      expect(failure).not.toHaveBeenCalled();
    });

    it("calls only failure callback when state is invalid", () => {
      const formConfig = createForm<RegisterModel>()({
        username: field.text(),
        password: field.password("secret")
      }).withValidation({
        username: yup.string().required()
      });

      const { container } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <form onSubmit={fluentForm.handleSubmit(success, failure)}>
            <button type="submit">Submit</button>
          </form>
        )
      );

      fireEvent.click(container.querySelector("button")!);

      expect(success).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalledTimes(1);
    });

    it("prevents submitting again while other submit process is running", async () => {
      const formConfig = createForm<RegisterModel>()({
        username: field.text(),
        password: field.password()
      });

      const { result } = renderHook(() => useFluentForm(formConfig));

      actHooks(() => {
        result.current.handleSubmit(success)();
        result.current.handleSubmit(success)();
      });

      expect(success).toHaveBeenCalledTimes(1);
    });

    it("triggers validation for all fields and sets touched state", () => {
      () => {
        const formConfig = createForm<RegisterModel>()({
          username: field.text(),
          password: field.password("secret").validateOnChange()
        }).withValidation({
          username: yup.string().required(),
          password: yup.string().required()
        });

        const { container, fluentFormRef } = renderWithFluentForm(
          formConfig,
          ({ fluentForm }) => (
            <form onSubmit={fluentForm.handleSubmit()}>
              <button type="submit">Submit</button>
            </form>
          )
        );

        fireEvent.click(container.querySelector("button")!);

        expect(fluentFormRef.current.touched).toMatchObject({
          username: true,
          password: true
        });

        expect(fluentFormRef.current.validity).toMatchObject({
          username: false,
          password: true
        });

        expect(fluentFormRef.current.errors).toMatchObject({
          username: expect.any(Array),
          password: undefined
        });
      };
    });
  });

  describe("setInitialValues and reset", () => {
    it("is able to reset form", () => {
      const formConfig = createForm<UserModel>()({
        username: field.text(),
        email: field.email("initial@email.com")
      }).withValidation({
        username: yup.string().required()
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <>
            <input {...fluentForm.fields.username} />
            <input {...fluentForm.fields.email} />
          </>
        )
      );

      const [userInput, emailInput] = Array.from(
        container.querySelectorAll("input")
      );

      act(() => {
        fireEvent.change(userInput, { target: { value: "ysfaran" } });
        fireEvent.change(emailInput, {
          target: { value: "updated@email.com" }
        });
      });

      expect(fluentFormRef.current.values).toMatchObject({
        username: "ysfaran",
        email: "updated@email.com"
      });

      act(() => {
        fluentFormRef.current.reset();
      });

      expect(fluentFormRef.current.values).toMatchObject({
        username: "",
        email: "initial@email.com"
      });
    });

    it("allows change initial values", () => {
      const formConfig = createForm<UserModel>()({
        username: field.text(),
        email: field.email("initial@email.com")
      }).withValidation({
        username: yup.string().required()
      });

      const { fluentFormRef, getByDisplayValue } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <>
            <input {...fluentForm.fields.username} />
            <input {...fluentForm.fields.email} />
          </>
        )
      );

      act(() => {
        fluentFormRef.current.setInitialValues({
          username: "initial-user",
          email: "new-initial@email.org"
        });
      });

      act(() => {
        fluentFormRef.current.reset();
      });

      expect(getByDisplayValue("initial-user")).toBeInTheDocument();
      expect(getByDisplayValue("new-initial@email.org")).toBeInTheDocument();

      expect(fluentFormRef.current.values).toMatchObject({
        username: "initial-user",
        email: "new-initial@email.org"
      });
    });
  });
});
