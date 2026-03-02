import { describe, expect, it } from "vitest";
import { useSetup } from "../_test";
import { useNewsletter } from "./useNewsletter";

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

  it("getNewsletterStatus", async () => {
    const { vm, injections } = useSetup(useNewsletter);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });

    await vm.getNewsletterStatus();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readNewsletterRecipient"),
    );
  });

  it("isNewsletterSubscriber", async () => {
    const { vm } = useSetup(useNewsletter);

    expect(vm.isNewsletterSubscriber).toBe(false);
    vm.newsletterStatus = "direct";
    expect(vm.isNewsletterSubscriber).toBe(true);
  });

  it("confirmationNeeded when status is notSet", async () => {
    const { vm, injections } = useSetup(useNewsletter);
    injections.apiClient.invoke.mockResolvedValue({
      data: { status: "notSet" },
    });

    await vm.getNewsletterStatus();
    expect(vm.confirmationNeeded).toBe(true);
  });

  it("returns SUBSRIBE_KEY and UNSUBSCRIBE_KEY", () => {
    const { vm } = useSetup(useNewsletter);
    expect(vm.SUBSRIBE_KEY).toBe("subscribe");
    expect(vm.UNSUBSCRIBE_KEY).toBe("unsubscribe");
  });
});
