import { describe, expect, it } from "vitest";
import { useNewsletter } from "./useNewsletter";
import { useSetup } from "./_test";

describe("useNewsletter", () => {
  it("newsletter subscribe", async () => {
    const { vm, injections } = useSetup(useNewsletter);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });

    await vm.newsletterSubscribe({
      email: "test@shopware.com",
      option: "subscribe",
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("subscribeToNewsletter"),
      expect.anything(),
    );
  });

  it("newsletter unsubscribe", async () => {
    const { vm, injections } = useSetup(useNewsletter);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });

    await vm.newsletterUnsubscribe("sometestemail@shopware.com");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("unsubscribeToNewsletter"),
      {
        body: {
          email: "sometestemail@shopware.com",
        },
      },
    );
  });
});
