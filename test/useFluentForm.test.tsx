import React from "react";

import { fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import {
  addField,
  createForm,
  field,
  FieldCreator,
  useFluentForm
} from "../src";
import { FormConfig } from "../src/form-config/FormConfig";
import { fluentFormReducer } from "../src/hooks/fluent-form/state-manager/reducer";
import { CustomField } from "./test-helper/CustomField";
import { renderWithFluentForm } from "./test-utils/renderWithFluentForm";
import { UsernameModel } from "./types";

describe("useFluentForm", () => {
  it("initializes state from config", () => {
    const formConfig = new FormConfig({
      username: field.text("user"),
      email: field.email(),
      age: field.number("30")
    });

    formConfig
      .withContext({ contextValue: 0 })
      .withInitialValues({ age: "25" });

    const { result } = renderHook(() => useFluentForm(formConfig));
    const { current } = result;

    expect(current.values).toMatchObject({
      username: "user",
      email: "",
      age: "25"
    });

    expect(current.touched).toMatchObject({});
    expect(current.validity).toMatchObject({});
    expect(current.errors).toMatchObject({});
    expect(current.context).toMatchObject({ contextValue: 0 });
    expect(current.submitting).toBe(false);
  });

  // for 100% coverage
  it("reducer returns current state when action type doesn't match any", () => {
    const currentState = { a: "just anything" } as any;
    const updatedState = fluentFormReducer<any, any, any>(currentState, {
      type: "NOT_EXISTING_TYPE"
    } as any);

    expect(currentState).toBe(updatedState);
  });

  describe("addField", () => {
    beforeEach(() => {
      addField("customField", initialValue => new CustomField(initialValue));
    });

    afterEach(() => {
      delete (FieldCreator.prototype as any).customField;
    });

    it("allows adding custom fields", async () => {
      const formConfig = createForm<UsernameModel>()({
        username: (field as any).customField()
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => <input {...fluentForm.fields.username} />
      );

      const input = container.querySelector("input")!;

      fireEvent.blur(input);
      fireEvent.blur(input); // for 100% coverage

      expect(fluentFormRef.current.touched.username).toBe(true);

      fireEvent.change(input, { target: { value: "a" } });

      expect(fluentFormRef.current.touched.username).toBe(false);
    });
  });
});
