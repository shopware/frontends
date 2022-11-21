import { defaultInstance } from "../../apiService";
import { isNewsletterSubscriber } from "../customerService";
import { getNewsletterRecipientEndpoint } from "../../endpoints";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - isNewsletterSubscriber", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("returns no data if successfully updated", async () => {
    mockedPost.mockResolvedValueOnce({
      status: "undefined",
      apiAlias: "account_newsletter_recipient",
    });
    const result = await isNewsletterSubscriber();

    expect(result).toBeFalsy();
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getNewsletterRecipientEndpoint());
  });
});
