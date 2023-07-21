import { newsletterConfirmation } from "../newsletterService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("NewsletterService - newsletterConfirmation", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("should confirm newsletter", async () => {
    mockedPost.mockResolvedValueOnce({ data: { data: {} } });
    const result = await newsletterConfirmation({
      hash: "232323",
      em: "44242456",
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(`/store-api/newsletter/confirm`, {
      hash: "232323",
      em: "44242456",
    });
    expect(result).toMatchObject({});
  });
});
