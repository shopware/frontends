import { describe, expect, it } from "vitest";

import {
  emptyFormServerErrors,
  splitFormViolations,
  withoutFieldError,
} from "./formServerErrors";

const FIELDS = ["email", "firstName"] as const;

describe("splitFormViolations", () => {
  it("puts a violation of a known field under that field and the rest into the form", () => {
    expect(
      splitFormViolations(
        {
          ok: false,
          message: "Summary",
          violations: [
            { field: "email", code: "VIOLATION::IS_BLANK_ERROR", message: "A" },
            { field: "storefrontUrl", message: "B" },
            { message: "C" },
          ],
        },
        FIELDS,
      ),
    ).toEqual({ fields: { email: "A" }, form: ["B", "C"] });
  });

  it("keeps the first violation of a field", () => {
    expect(
      splitFormViolations(
        {
          ok: false,
          violations: [
            { field: "email", message: "Value is required" },
            { field: "email", message: "Value is not a valid email address" },
          ],
        },
        FIELDS,
      ),
    ).toEqual({ fields: { email: "Value is required" }, form: [] });
  });

  it("deduplicates form messages and skips blank ones", () => {
    expect(
      splitFormViolations(
        {
          ok: false,
          violations: [
            { message: "Try again" },
            { field: "option", message: "Try again" },
            { message: "  " },
          ],
        },
        FIELDS,
      ),
    ).toEqual({ fields: {}, form: ["Try again"] });
  });

  it("shows the message only when there are no violations", () => {
    expect(
      splitFormViolations({ ok: false, message: "Failed" }, FIELDS),
    ).toEqual({ fields: {}, form: ["Failed"] });
    expect(
      splitFormViolations(
        { ok: false, message: "Failed", violations: [] },
        FIELDS,
      ),
    ).toEqual({ fields: {}, form: ["Failed"] });
    expect(
      splitFormViolations(
        {
          ok: false,
          message: "Failed",
          violations: [{ field: "firstName", message: "Too short" }],
        },
        FIELDS,
      ),
    ).toEqual({ fields: { firstName: "Too short" }, form: [] });
  });

  it("gives nothing for a result without a message or violations", () => {
    expect(splitFormViolations({ ok: false }, FIELDS)).toEqual(
      emptyFormServerErrors(),
    );
    expect(splitFormViolations({ ok: false, message: " " }, FIELDS)).toEqual(
      emptyFormServerErrors(),
    );
  });
});

describe("withoutFieldError", () => {
  it("drops one field and keeps the others and the form messages", () => {
    const errors = {
      fields: { email: "A", firstName: "B" },
      form: ["C"],
    };

    expect(withoutFieldError(errors, "email")).toEqual({
      fields: { firstName: "B" },
      form: ["C"],
    });
    expect(errors.fields).toEqual({ email: "A", firstName: "B" });
  });

  it("returns the same object when the field has no error", () => {
    const errors = { fields: { email: "A" }, form: [] };

    expect(withoutFieldError<"email" | "firstName">(errors, "firstName")).toBe(
      errors,
    );
  });
});
