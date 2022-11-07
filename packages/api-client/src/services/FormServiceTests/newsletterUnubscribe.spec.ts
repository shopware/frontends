import { newsletterUnsubscribe } from "../formsService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("FormService - newsletterUnsubscribe", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should invoke correct API endpoint with given parameters", async () => {
    await newsletterUnsubscribe({ email: "john@doe.com" });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/newsletter/unsubscribe", {
      email: "john@doe.com",
    });
  });

  it("should throw an error when data is incorrect", async () => {
    mockedPost.mockRejectedValueOnce(new Error("500"));
    expect(newsletterUnsubscribe({ email: "" })).rejects.toThrowError("500");
    expect(mockedPost).toBeCalledWith("/store-api/newsletter/unsubscribe", {
      email: "",
    });
  });
});
