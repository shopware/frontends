import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import {
  interact,
  mount,
  query,
  setInputValue,
  submitForm,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import type { PromotionCodeResult } from "../types";
import {
  cartView,
  fakeCart,
  lineItem,
  promotionItem,
} from "./cartView.fixture";
import type { CartView } from "./cartView.fixture";
import { PromotionCodeForm } from "./PromotionCodeForm";

vi.mock("@/features/cart/useCart", async () => ({
  useCart: (await import("./cartView.fixture")).useFakeCart,
}));

const INPUT = '[data-testid="cart-promotion-code-input"]';
const SUBMIT = '[data-testid="cart-promotion-code-submit"]';

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

async function setup(
  addPromotionCode: CartView["addPromotionCode"],
  overrides: Partial<CartView> = {},
  locale?: Locale,
) {
  const add = vi.fn(addPromotionCode);
  fakeCart.set(
    cartView({ lineItems: [lineItem()], addPromotionCode: add, ...overrides }),
  );
  const notify = vi.fn();
  const form = (
    <CmsActionsProvider actions={{ notify }}>
      <PromotionCodeForm id="promo" />
    </CmsActionsProvider>
  );
  mounted = await mount(locale ? withI18n(form, locale) : form);
  const { container } = mounted;
  const input = () => query<HTMLInputElement>(container, INPUT);
  return {
    container,
    notify,
    add,
    input,
    button: () => query<HTMLButtonElement>(container, SUBMIT),
    type: (value: string) => interact(() => setInputValue(input(), value)),
    submit: () =>
      interact(() => submitForm(query<HTMLFormElement>(container, "form"))),
  };
}

function resolved(result: PromotionCodeResult): CartView["addPromotionCode"] {
  return async () => result;
}

describe("PromotionCodeForm", () => {
  it("labels the field and the button", async () => {
    const { container, input, button } = await setup(
      resolved({ ok: true, applied: true }),
    );

    expect(
      query<HTMLLabelElement>(container, 'label[for="promo-input"]')
        .textContent,
    ).toBe("Promo code");
    expect(input().name).toBe("promoCode");
    expect(input().placeholder).toBe("Enter promo code");
    expect(input().autocomplete).toBe("off");
    expect(button().type).toBe("submit");
    expect(button().textContent).toBe("Apply");
  });

  it("asks for a code without sending one", async () => {
    const { container, notify, add, input, type, submit } = await setup(
      resolved({ ok: true, applied: true }),
    );
    await type("   ");

    await submit();

    expect(add).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
    expect(input().getAttribute("aria-invalid")).toBe("true");
    expect(input().getAttribute("aria-describedby")).toBe("promo-error");
    expect(query(container, "#promo-error").textContent).toBe(
      "Value is required",
    );
    expect(document.activeElement).toBe(input());

    await type("S");
    expect(input().hasAttribute("aria-invalid")).toBe(false);
    expect(container.querySelector("#promo-error")).toBeNull();
  });

  it("applies the code, confirms it, clears the field and reports side notices", async () => {
    const { notify, add, input, type, submit } = await setup(
      resolved({
        ok: true,
        applied: true,
        errors: [
          {
            messageKey: "promotion-excluded",
            key: "promotion-excluded",
            level: 0,
          },
        ],
      }),
    );
    await type(" SUMMER ");

    await submit();

    expect(add).toHaveBeenCalledWith(" SUMMER ");
    expect(notify.mock.calls.map(([call]) => call)).toEqual([
      {
        type: "success",
        message: "Promo code added successfully. Shopping cart updated.",
      },
      {
        type: "info",
        message: expect.stringContaining("One or more discounts"),
      },
    ]);
    expect(input().value).toBe("");
    expect(input().hasAttribute("aria-invalid")).toBe(false);
  });

  it("reports an unknown code with the code and keeps it for a correction", async () => {
    const { container, notify, input, type, submit } = await setup(
      resolved({
        ok: true,
        applied: false,
        errors: [
          {
            messageKey: "promotion-not-found",
            params: { promotionCode: "SUMMR" },
            key: "promotion-not-found",
            level: 20,
          },
        ],
      }),
    );
    await type("SUMMR");

    await submit();

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({
      type: "error",
      message: "Promotion with code SUMMR could not be found.",
    });
    expect(input().value).toBe("SUMMR");
    expect(input().getAttribute("aria-invalid")).toBe("true");
    expect(input().getAttribute("aria-describedby")).toBe("promo-error");
    expect(query(container, "#promo-error").textContent).toBe(
      "Promotion with code SUMMR could not be found.",
    );
  });

  it("reports a code that is valid but not eligible as a notice", async () => {
    const { container, notify, input, button, type, submit } = await setup(
      resolved({
        ok: true,
        applied: false,
        errors: [
          {
            messageKey: "promotion-not-eligible",
            key: "promotion-not-eligible",
            level: 0,
          },
        ],
      }),
    );
    await type("SUMMER");
    button().focus();

    await submit();

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({
      type: "info",
      message: expect.stringContaining("Promotion code valid"),
    });
    expect(input().getAttribute("aria-invalid")).toBe("true");
    expect(input().getAttribute("aria-describedby")).toBe("promo-error");
    expect(query(container, "#promo-error").textContent).toContain(
      "Promotion code valid",
    );
    expect(document.activeElement).toBe(input());

    await type("SUMMER2");
    expect(input().hasAttribute("aria-invalid")).toBe(false);
  });

  it("says that a code was not applied when the cart reports nothing", async () => {
    const { container, notify, type, submit } = await setup(
      resolved({ ok: true, applied: false, errors: [] }),
    );
    await type("SUMMER");

    await submit();

    expect(notify.mock.calls).toEqual([
      [{ type: "info", message: "The promo code could not be applied." }],
    ]);
    expect(query(container, "#promo-error").textContent).toBe(
      "The promo code could not be applied.",
    );
  });

  it("shows the message of a failed request", async () => {
    const { container, notify, input, type, submit } = await setup(
      resolved({ ok: false, applied: false, message: "Request failed" }),
    );
    await type("SUMMER");

    await submit();

    expect(notify.mock.calls).toEqual([
      [{ type: "error", message: "Request failed" }],
    ]);
    expect(input().value).toBe("SUMMER");
    expect(query(container, "#promo-error").textContent).toBe("Request failed");
  });

  it("reports a failure without a message as not applied", async () => {
    const { notify, type, submit } = await setup(
      resolved({ ok: false, applied: false }),
    );
    await type("SUMMER");

    await submit();

    expect(notify.mock.calls).toEqual([
      [{ type: "error", message: "The promo code could not be applied." }],
    ]);
  });

  it("does not send a code that is already applied", async () => {
    const { notify, add, input, type, submit } = await setup(
      resolved({ ok: true, applied: true }),
      { lineItems: [lineItem(), promotionItem()] },
    );
    await type("summer");

    await submit();

    expect(add).not.toHaveBeenCalled();
    expect(notify.mock.calls).toEqual([
      [{ type: "info", message: "This promo code has already been applied." }],
    ]);
    expect(input().value).toBe("");
  });

  it("sends one request per submit while it runs and stays focusable", async () => {
    const request = deferred<PromotionCodeResult>();
    const { add, button, type, submit } = await setup(() => request.promise);
    await type("SUMMER");

    await submit();
    await submit();

    expect(add).toHaveBeenCalledTimes(1);
    expect(button().getAttribute("aria-busy")).toBe("true");
    expect(button().disabled).toBe(false);

    await interact(() => request.resolve({ ok: true, applied: true }));

    expect(button().hasAttribute("aria-busy")).toBe(false);
    await type("WINTER");
    await submit();
    expect(add).toHaveBeenCalledTimes(2);
  });
});

describe("PromotionCodeForm in other locales", () => {
  it.each([
    ["pl-PL", "Kod promocyjny", "Zastosuj", "Wpisz kod promocyjny"],
    ["de-DE", "Promo-Code", "Einlösen", "Promo-Code eingeben"],
  ] as const)(
    "labels the %s form and its messages",
    async (locale, label, apply, placeholder) => {
      const { container, button, input, notify, type, submit } = await setup(
        resolved({ ok: true, applied: false, errors: [] }),
        {},
        locale,
      );

      expect(query<HTMLLabelElement>(container, "label").textContent).toBe(
        label,
      );
      expect(button().textContent).toBe(apply);
      expect(input().placeholder).toBe(placeholder);

      await type("SUMMER");
      await submit();
      expect(notify).toHaveBeenCalledWith({
        type: "info",
        message:
          locale === "pl-PL"
            ? "Nie udało się zastosować kodu promocyjnego."
            : "Der Promo-Code konnte nicht eingelöst werden.",
      });
    },
  );
});
