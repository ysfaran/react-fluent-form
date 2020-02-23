import React from "react";

import { fireEvent } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";

import { createForm, field, useFluentForm } from "../src";
import { renderWithFluentForm } from "./test-utils/renderWithFluentForm";
import {
  AgeModel,
  CarModel,
  ColorModel,
  CommentModel,
  MultiColorModel,
  NameModel,
  SendEmailModel
} from "./types";

describe("useFluentForm (fields)", () => {
  describe("text", () => {
    it("is by default not touched and empty string", () => {
      const formConfig = createForm<NameModel>()({
        name: field.text()
      });

      const { fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => <input {...fluentForm.fields.name} />
      );
      expect(fluentFormRef.current.values.name).toBe("");
      expect(fluentFormRef.current.touched.name).toBeFalsy();
    });

    it("allows passing initial value", () => {
      const formConfig = createForm<NameModel>()({
        name: field.text("ysfaran")
      });

      const {
        fluentFormRef,
        queryByDisplayValue
      } = renderWithFluentForm(formConfig, ({ fluentForm }) => (
        <input {...fluentForm.fields.name} />
      ));

      expect(fluentFormRef.current.values.name).toBe("ysfaran");
      expect(fluentFormRef.current.touched.name).toBeFalsy();
      expect(queryByDisplayValue("ysfaran"));
    });

    it("is touched when blurred", () => {
      const formConfig = createForm<NameModel>()({
        name: field.text()
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => <input {...fluentForm.fields.name} />
      );

      const input = container.querySelector("input")!;

      fireEvent.blur(input);

      expect(fluentFormRef.current.touched.name).toBeTruthy();
    });

    it("updates state and input value on change", () => {
      const formConfig = createForm<{ name: string }>()({
        name: field.text()
      });

      const {
        container,
        fluentFormRef,
        queryByDisplayValue
      } = renderWithFluentForm(formConfig, ({ fluentForm }) => (
        <input {...fluentForm.fields.name} />
      ));
      const input = container.querySelector("input")!;

      fireEvent.change(input, { target: { value: "ysfaran" } });

      expect(fluentFormRef.current.values.name).toBe("ysfaran");
      expect(queryByDisplayValue("ysfaran"));
    });
  });

  describe("checkbox", () => {
    it("is by default not touched and false", () => {
      const formConfig = createForm<SendEmailModel>()({
        sendEmail: field.checkbox().type("checkbox") // for 100% coverage
      });

      const { fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => <input {...fluentForm.fields.sendEmail} />
      );

      expect(fluentFormRef.current.values.sendEmail).toBeFalsy();
      expect(fluentFormRef.current.touched.sendEmail).toBeFalsy();
    });

    it("allows passing initial value", () => {
      const formConfig = createForm<SendEmailModel>()({
        sendEmail: field.checkbox(true)
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => <input {...fluentForm.fields.sendEmail} />
      );

      const input = container.querySelector("input")!;

      expect(fluentFormRef.current.values.sendEmail).toBeTruthy();
      expect(fluentFormRef.current.touched.sendEmail).toBeFalsy();
      expect(input.checked).toBeTruthy();
    });

    it("is touched when blurred", () => {
      const formConfig = createForm<SendEmailModel>()({
        sendEmail: field.checkbox()
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => <input {...fluentForm.fields.sendEmail} />
      );

      const input = container.querySelector("input")!;

      fireEvent.blur(input);

      expect(fluentFormRef.current.touched.sendEmail).toBeTruthy();
    });

    it("updates state and input value on change", () => {
      const formConfig = createForm<SendEmailModel>()({
        sendEmail: field.checkbox()
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => <input {...fluentForm.fields.sendEmail} />
      );
      const input = container.querySelector("input")!;

      fireEvent.click(input);

      expect(fluentFormRef.current.values.sendEmail).toBeTruthy();
      expect(input.checked).toBeTruthy();
    });
  });

  describe("radio", () => {
    it("is by default not touched and empty string", () => {
      const formConfig = createForm<ColorModel>()({
        color: field
          .radio()
          .name("color")
          .type("radio") // for 100% coverage
          .unselectable(false) // for 100% coverage
      });

      const { fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <>
            <input {...fluentForm.fields.color("red")} />
            <input {...fluentForm.fields.color("green")} />
            <input {...fluentForm.fields.color("blue")} />
          </>
        )
      );

      expect(fluentFormRef.current.values.color).toBe("");
      expect(fluentFormRef.current.touched.color).toBeFalsy();
    });

    it("allows passing initial value", () => {
      const formConfig = createForm<ColorModel>()({
        color: field.radio("green")
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <>
            <input {...fluentForm.fields.color("red")} />
            <input {...fluentForm.fields.color("green")} />
            <input {...fluentForm.fields.color("blue")} />
          </>
        )
      );

      const inputs = container.querySelectorAll("input");

      expect(fluentFormRef.current.values.color).toBe("green");
      expect(inputs[1].checked).toBeTruthy();
      expect(fluentFormRef.current.touched.color).toBeFalsy();
    });

    it("is touched when any radio button blurres", () => {
      const formConfig = createForm<ColorModel>()({
        color: field.radio().name("color")
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <>
            <input {...fluentForm.fields.color("red")} />
            <input {...fluentForm.fields.color("green")} />
            <input {...fluentForm.fields.color("blue")} />
          </>
        )
      );

      const inputs = container.querySelectorAll("input");

      fireEvent.blur(inputs[0]);

      expect(fluentFormRef.current.touched.color).toBeTruthy();
    });

    it("updates state and input checked on change", () => {
      const formConfig = createForm<ColorModel>()({
        color: field.radio().name("color")
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <>
            <input {...fluentForm.fields.color("red")} />
            <input {...fluentForm.fields.color("green")} />
            <input {...fluentForm.fields.color("blue")} />
          </>
        )
      );
      const inputs = container.querySelectorAll("input");

      fireEvent.click(inputs[0]);

      expect(fluentFormRef.current.values.color).toBe("red");
      expect(inputs[0].checked).toBeTruthy();
      expect(inputs[1].checked).toBeFalsy();
      expect(inputs[2].checked).toBeFalsy();

      fireEvent.click(inputs[2]);

      expect(fluentFormRef.current.values.color).toBe("blue");
      expect(inputs[0].checked).toBeFalsy();
      expect(inputs[1].checked).toBeFalsy();
      expect(inputs[2].checked).toBeTruthy();
    });

    it("is by default not unselectable", () => {
      const formConfig = createForm<ColorModel>()({
        color: field.radio().name("color")
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <>
            <input {...fluentForm.fields.color("red")} />
            <input {...fluentForm.fields.color("green")} />
            <input {...fluentForm.fields.color("blue")} />
          </>
        )
      );

      const inputs = container.querySelectorAll("input");

      fireEvent.click(inputs[0]);
      fireEvent.click(inputs[0]);

      expect(fluentFormRef.current.values.color).toBe("red");
    });

    it("can optionally be made unselectable", () => {
      const formConfig = createForm<ColorModel>()({
        color: field
          .radio()
          .name("color")
          .unselectable()
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <>
            <input {...fluentForm.fields.color("red")} />
            <input {...fluentForm.fields.color("green")} />
            <input {...fluentForm.fields.color("blue")} />
          </>
        )
      );

      const inputs = container.querySelectorAll("input");

      fireEvent.click(inputs[0]);
      fireEvent.click(inputs[0]);

      expect(fluentFormRef.current.values.color).toBe("");
    });

    it("works with multiple radio button groups", () => {
      const formConfig = createForm<MultiColorModel>()({
        firstColor: field.radio().name("color1"),
        secondColor: field.radio().name("color2")
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <>
            <input {...fluentForm.fields.firstColor("red")} />
            <input {...fluentForm.fields.firstColor("green")} />
            <input {...fluentForm.fields.firstColor("blue")} />
            <input {...fluentForm.fields.secondColor("red")} />
            <input {...fluentForm.fields.secondColor("green")} />
            <input {...fluentForm.fields.secondColor("blue")} />
          </>
        )
      );

      expect(fluentFormRef.current.values.firstColor).toBe("");
      expect(fluentFormRef.current.touched.firstColor).toBeFalsy();

      const inputs = container.querySelectorAll("input");

      fireEvent.click(inputs[1]);
      fireEvent.blur(inputs[1]);
      fireEvent.click(inputs[5]);
      fireEvent.blur(inputs[5]);

      expect(fluentFormRef.current.values.firstColor).toBe("green");
      expect(fluentFormRef.current.touched.firstColor).toBeTruthy();
      expect(inputs[0].checked).toBeFalsy();
      expect(inputs[1].checked).toBeTruthy();
      expect(inputs[2].checked).toBeFalsy();

      expect(fluentFormRef.current.values.secondColor).toBe("blue");
      expect(fluentFormRef.current.touched.secondColor).toBeTruthy();
      expect(inputs[3].checked).toBeFalsy();
      expect(inputs[4].checked).toBeFalsy();
      expect(inputs[5].checked).toBeTruthy();
    });
  });

  describe("select", () => {
    it("is by default not touched and empty string", () => {
      const formConfig = createForm<CarModel>()({
        brand: field.select()
      });

      const { fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <select {...fluentForm.fields.brand.select}>
            <option {...fluentForm.fields.brand.option("BMW")} />
            <option {...fluentForm.fields.brand.option("Mercedes")} />
            <option {...fluentForm.fields.brand.option("Audi")} />
          </select>
        )
      );

      expect(fluentFormRef.current.values.brand).toBe("");
      expect(fluentFormRef.current.touched.brand).toBeFalsy();
    });

    it("allows passing initial value", () => {
      const formConfig = createForm<CarModel>()({
        brand: field.select("BMW")
      });

      const { fluentFormRef, queryByDisplayValue } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <select {...fluentForm.fields.brand.select}>
            <option {...fluentForm.fields.brand.option("BMW")} />
            <option {...fluentForm.fields.brand.option("Mercedes")} />
            <option {...fluentForm.fields.brand.option("Audi")} />
          </select>
        )
      );

      expect(fluentFormRef.current.values.brand).toBe("BMW");
      expect(queryByDisplayValue("BMW"));
      expect(fluentFormRef.current.touched.brand).toBeFalsy();
    });

    it("is touched when blurred", () => {
      const formConfig = createForm<CarModel>()({
        brand: field.select()
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => (
          <select {...fluentForm.fields.brand.select}>
            <option {...fluentForm.fields.brand.option("BMW")} />
            <option {...fluentForm.fields.brand.option("Mercedes")} />
            <option {...fluentForm.fields.brand.option("Audi")} />
          </select>
        )
      );

      const select = container.querySelector("select")!;

      fireEvent.blur(select);

      expect(fluentFormRef.current.touched.brand).toBeTruthy();
    });

    it("updates state and input value on change", () => {
      const formConfig = createForm<CarModel>()({
        brand: field.select()
      });

      const {
        container,
        fluentFormRef,
        queryByDisplayValue
      } = renderWithFluentForm(formConfig, ({ fluentForm }) => (
        <select {...fluentForm.fields.brand.select}>
          <option {...fluentForm.fields.brand.option("BMW")} />
          <option {...fluentForm.fields.brand.option("Mercedes")} />
          <option {...fluentForm.fields.brand.option("Audi")} />
        </select>
      ));
      const select = container.querySelector("select")!;

      fireEvent.change(select, { target: { value: "BMW" } });

      expect(fluentFormRef.current.values.brand).toBe("BMW");
      expect(queryByDisplayValue("BMW"));
    });
  });

  describe("textarea", () => {
    it("is by default not touched and empty string", () => {
      const formConfig = createForm<CommentModel>()({
        comment: field.textarea()
      });

      const { fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => <textarea {...fluentForm.fields.comment} />
      );
      expect(fluentFormRef.current.values.comment).toBe("");
      expect(fluentFormRef.current.touched.comment).toBeFalsy();
    });

    it("allows passing initial value", () => {
      const formConfig = createForm<CommentModel>()({
        comment: field.textarea("fluent form is cool!")
      });

      const {
        fluentFormRef,
        queryByDisplayValue
      } = renderWithFluentForm(formConfig, ({ fluentForm }) => (
        <textarea {...fluentForm.fields.comment} />
      ));

      expect(fluentFormRef.current.values.comment).toBe("fluent form is cool!");
      expect(fluentFormRef.current.touched.comment).toBeFalsy();
      expect(queryByDisplayValue("fluent form is cool!"));
    });

    it("is touched when blurred", () => {
      const formConfig = createForm<CommentModel>()({
        comment: field.textarea()
      });

      const { container, fluentFormRef } = renderWithFluentForm(
        formConfig,
        ({ fluentForm }) => <textarea {...fluentForm.fields.comment} />
      );

      const textarea = container.querySelector("textarea")!;

      fireEvent.blur(textarea);

      expect(fluentFormRef.current.touched.comment).toBeTruthy();
    });

    it("updates state and textarea value on change", () => {
      const formConfig = createForm<{ comment: string }>()({
        comment: field.textarea()
      });

      const {
        container,
        fluentFormRef,
        queryByDisplayValue
      } = renderWithFluentForm(formConfig, ({ fluentForm }) => (
        <textarea {...fluentForm.fields.comment} />
      ));
      const textarea = container.querySelector("textarea")!;

      fireEvent.change(textarea, { target: { value: "fluent form is cool!" } });

      expect(fluentFormRef.current.values.comment).toBe("fluent form is cool!");
      expect(queryByDisplayValue("fluent form is cool!"));
    });
  });

  describe("raw", () => {
    it("is by default not touched and allows passing initial value", () => {
      const formConfig = createForm<AgeModel>()({
        age: field.raw(5)
      });

      const { result } = renderHook(() => useFluentForm(formConfig));

      expect(result.current.values.age).toBe(5);
      expect(result.current.fields.age.value).toBe(5);
      expect(result.current.touched.age).toBeFalsy();
    });

    it("is touched when blurred", () => {
      const formConfig = createForm<AgeModel>()({
        age: field.raw(5)
      });

      const { result } = renderHook(() => useFluentForm(formConfig));

      act(() => result.current.fields.age.onBlur());

      expect(result.current.touched.age).toBeTruthy();
    });

    it("updates state and value on change", () => {
      const formConfig = createForm<AgeModel>()({
        age: field.raw(5)
      });

      const { result } = renderHook(() => useFluentForm(formConfig));

      act(() => result.current.fields.age.onChange(30));

      expect(result.current.values.age).toBe(30);
      expect(result.current.fields.age.value).toBe(30);
    });
  });
});
