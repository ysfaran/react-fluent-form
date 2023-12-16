import React from "react";
import * as yup from "yup";

import { fireEvent } from "@testing-library/react";

import { field } from "../src/fields/FieldCreatorInstance";
import { createForm } from "../src/form-config/FormCreators";
import { RequiredValidator } from "./test-helper/RequiredValidator";
import { renderWithFluentForm } from "./test-utils/renderWithFluentForm";
import { UserModel } from "./types";
import { z } from "zod";

describe("useFluentForm (validations)", () => {
  it("allows passing custom validator", () => {
    const formConfig = createForm<UserModel>()({
      username: field.text(),
      email: field.email(),
      password: field.password(),
    }).withCustomValidator(
      new RequiredValidator<UserModel>({
        username: "required",
      }),
    );

    const { fluentFormRef, container } = renderWithFluentForm(
      formConfig,
      ({ fluentForm }) => (
        <>
          <input {...fluentForm.fields.username} />
          <input {...fluentForm.fields.email} />
        </>
      ),
    );

    const [usernameInput, emailInput] = Array.from(
      container.querySelectorAll("input"),
    );

    fireEvent.blur(usernameInput);
    fireEvent.blur(emailInput);

    expect(fluentFormRef.current.validity).toMatchObject({
      username: false,
      email: true,
    });

    expect(fluentFormRef.current.errors).toMatchObject({
      username: expect.any(String),
      email: undefined,
    });
  });

  describe("validity state", () => {
    const renderForm = () => {
      const formConfig = createForm<UserModel>()({
        username: field.text(),
        email: field.email(),
        password: field.password(),
      }).withValidation({
        username: yup.string().required(),
        email: (email) => {
          if (!email) {
            return "error";
          }
        },
        password: z.string().min(1),
      });

      return renderWithFluentForm(formConfig, ({ fluentForm }) => (
        <>
          <input {...fluentForm.fields.username} />
          <input {...fluentForm.fields.email} />
          <input {...fluentForm.fields.password} />
        </>
      ));
    };

    let renderedForm: ReturnType<typeof renderForm>;

    beforeEach(() => {
      renderedForm = renderForm();
    });

    it("is empty initially", () => {
      const { fluentFormRef } = renderedForm;
      expect(fluentFormRef.current.validity).toMatchObject({});
    });

    it("is false when validation fails", () => {
      const { fluentFormRef, container } = renderedForm;

      const [usernameInput, emailInput, passwordInput] = Array.from(
        container.querySelectorAll("input"),
      );

      fireEvent.blur(usernameInput);
      fireEvent.blur(emailInput);
      fireEvent.blur(passwordInput);

      expect(fluentFormRef.current.validity).toMatchObject({
        username: false,
        email: false,
        password: false,
      });
    });

    it("is set to true when validation succeeds", () => {
      const { fluentFormRef, container } = renderedForm;

      const [usernameInput, emailInput, passwordInput] = Array.from(
        container.querySelectorAll("input"),
      );

      fireEvent.change(usernameInput, { target: { value: "abc" } });
      fireEvent.change(emailInput, { target: { value: "abc" } });
      fireEvent.change(passwordInput, { target: { value: "abc" } });

      fireEvent.blur(usernameInput);
      fireEvent.blur(emailInput);
      fireEvent.blur(passwordInput);

      expect(fluentFormRef.current.validity).toMatchObject({
        username: true,
        email: true,
        password: true,
      });
    });
  });

  describe("validation triggers", () => {
    const createFormConfig = () =>
      createForm<UserModel>()({
        username: field.text(),
        email: field.email().validateOnSubmitOnly(),
        password: field.password(),
      }).withValidation({
        username: yup.string().required().min(10),
        email: (email) => {
          if (!email || email.length < 10) {
            return "error";
          }
        },
        password: z.string().min(8),
      });

    let formConfig: ReturnType<typeof createFormConfig>;

    beforeEach(() => {
      formConfig = createFormConfig();
    });

    it("validates after on blur by default", () => {
      const { fluentFormRef, container } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => <input {...fluentForm.fields.username} />,
      );

      const usernameInput = container.querySelector("input")!;

      fireEvent.change(usernameInput, {
        target: { value: "abc" },
      });

      expect(fluentFormRef.current.errors.username).not.toBeDefined();

      fireEvent.blur(usernameInput);

      expect(fluentFormRef.current.errors.username).toEqual(expect.any(Array));
    });

    it("validates after on change with validateOnChange option enabled", () => {
      formConfig.validateOnChange();

      const { fluentFormRef, container } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => <input {...fluentForm.fields.username} />,
      );

      fireEvent.change(container.querySelector("input")!, {
        target: { value: "abc" },
      });

      expect(fluentFormRef.current.errors.username).toEqual(expect.any(Array));
    });

    it("validates only when submitting with validateOnSubmitOnly option enabled", () => {
      formConfig.validateOnSubmitOnly();

      const { fluentFormRef, container } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <form onSubmit={fluentForm.handleSubmit()}>
            <input {...fluentForm.fields.username} />
            <button type="submit">Submit</button>
          </form>
        ),
      );

      const usernameInput = container.querySelector("input")!;

      fireEvent.change(usernameInput, {
        target: { value: "abc" },
      });

      fireEvent.blur(usernameInput);

      expect(fluentFormRef.current.errors.username).not.toBeDefined();

      fireEvent.click(container.querySelector("button")!);

      expect(fluentFormRef.current.errors.username).toEqual(expect.any(Array));
    });

    it("favors field level trigger before global trigger", () => {
      const { fluentFormRef, container } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <form onSubmit={fluentForm.handleSubmit()}>
            <input {...fluentForm.fields.email} />
            <button type="submit">Submit</button>
          </form>
        ),
      );

      const emailInput = container.querySelector("input")!;

      fireEvent.change(emailInput, {
        target: { value: "a@a.io" },
      });

      fireEvent.blur(emailInput);

      expect(fluentFormRef.current.errors.email).not.toBeDefined();

      fireEvent.click(container.querySelector("button")!);

      expect(fluentFormRef.current.errors.email).toEqual("error");
    });
  });
});
