import { describe, expect, it } from "vitest";
import { canUseQuoteActions } from "./canUseQuoteActions";

describe("canUseQuoteActions", () => {
  it("should return true", () => {
    expect(
      canUseQuoteActions({
        stateMachineState: {
          technicalName: "replied",
        },
      }),
    ).toEqual(true);
  });

  it("should return false", () => {
    expect(
      canUseQuoteActions({
        stateMachineState: {
          technicalName: "open",
        },
      }),
    ).toEqual(false);
  });
});
