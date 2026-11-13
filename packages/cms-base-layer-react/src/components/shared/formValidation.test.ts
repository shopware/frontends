import { describe, expect, it } from "vitest";

import {
  EMAIL_MESSAGE,
  REQUIRED_MESSAGE,
  email,
  isTrue,
  minLength,
  minLengthMessage,
  required,
  validateForm,
} from "./formValidation";

describe("required", () => {
  it("rejects empty, blank, null and undefined values", () => {
    expect(required.validate("")).toBe(false);
    expect(required.validate("   ")).toBe(false);
    expect(required.validate(null)).toBe(false);
    expect(required.validate(undefined)).toBe(false);
    expect(required.validate([])).toBe(false);
  });

  it("accepts text, false and non-empty arrays like vuelidate", () => {
    expect(required.validate("a")).toBe(true);
    expect(required.validate(false)).toBe(true);
    expect(required.validate(["x"])).toBe(true);
    expect(required.validate(0)).toBe(true);
  });
});

describe("email", () => {
  it("passes on empty values and valid addresses", () => {
    expect(email.validate("")).toBe(true);
    expect(email.validate("john.doe@example.com")).toBe(true);
    expect(email.validate("JOHN@EXAMPLE.CO.UK")).toBe(true);
  });

  it("fails on malformed addresses", () => {
    expect(email.validate("john")).toBe(false);
    expect(email.validate("john@")).toBe(false);
    expect(email.validate("john@example")).toBe(false);
    expect(email.validate("john doe@example.com")).toBe(false);
  });
});

describe("minLength", () => {
  it("passes on empty values and strings of the required length", () => {
    const rule = minLength(3);
    expect(rule.validate("")).toBe(true);
    expect(rule.validate("abc")).toBe(true);
    expect(rule.validate("ab")).toBe(false);
    expect(rule.message).toBe(
      "This field should be at least 3 characters long",
    );
    expect(minLengthMessage(10)).toBe(
      "This field should be at least 10 characters long",
    );
  });
});

describe("isTrue", () => {
  it("accepts only true and carries no message", () => {
    expect(isTrue.validate(true)).toBe(true);
    expect(isTrue.validate(false)).toBe(false);
    expect(isTrue.validate("true")).toBe(false);
    expect(isTrue.message).toBe("");
  });
});

describe("validateForm", () => {
  const rules = {
    email: [required, email],
    firstName: [required, minLength(3)],
    checkbox: [required, isTrue],
  };

  it("returns the first failing message per field", () => {
    const errors = validateForm(
      { email: "", firstName: "ab", checkbox: false },
      rules,
    );

    expect(errors).toEqual({
      email: REQUIRED_MESSAGE,
      firstName: minLengthMessage(3),
      checkbox: "",
    });
  });

  it("reports the email format once the field has a value", () => {
    const errors = validateForm(
      { email: "nope", firstName: "John", checkbox: true },
      rules,
    );

    expect(errors).toEqual({ email: EMAIL_MESSAGE });
  });

  it("returns no errors for valid values and skips fields without rules", () => {
    const errors = validateForm(
      { email: "john@example.com", firstName: "John", checkbox: true },
      { ...rules, firstName: undefined },
    );

    expect(errors).toEqual({});
  });
});
