import { useCmsActions } from "@shopware/cms-base-layer-react/client";
import type { CmsActionResult } from "@shopware/cms-base-layer-react/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import type { SessionActions } from "@/features/session/components/SessionActionsContext";
import type {
  RegistrationInput,
  SessionActionResult,
} from "@/features/session/types";
import { interact, mount, query, queryAll } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { NOT_WIRED_MESSAGES } from "../notWired";
import { StorefrontProviders } from "./StorefrontProviders";

const registration: RegistrationInput = {
  accountType: "private",
  acceptedDataProtection: true,
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  password: "password1",
  billingAddress: {
    id: "",
    customerId: "",
    firstName: "Jane",
    lastName: "Doe",
    street: "Main Street 1",
    zipcode: "12345",
    city: "Berlin",
    countryId: "country-de",
  },
};

type ActionName = keyof SessionActions;
type Call = (actions: SessionActions) => Promise<SessionActionResult>;

const CALLS: Record<ActionName, Call> = {
  login: (actions) =>
    actions.login({ username: "jane@example.com", password: "secret" }),
  register: (actions) => actions.register(registration),
  logout: (actions) => actions.logout(),
};

const ACTION_NAMES = Object.keys(CALLS) as ActionName[];
const TOAST = '[data-testid="notification-element-message"]';

function SessionConsumer({
  onResult,
}: {
  onResult: (name: ActionName, result: SessionActionResult) => void;
}) {
  const actions = useSessionActions();
  return (
    <>
      {ACTION_NAMES.map((name) => (
        <button
          key={name}
          type="button"
          data-testid={`call-${name}`}
          onClick={() => {
            void CALLS[name](actions).then((result) => onResult(name, result));
          }}
        >
          {name}
        </button>
      ))}
    </>
  );
}

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

async function setup() {
  const results: [ActionName, SessionActionResult][] = [];
  mounted = await mount(
    <StorefrontProviders>
      <SessionConsumer
        onResult={(name, result) => {
          results.push([name, result]);
        }}
      />
    </StorefrontProviders>,
  );
  return { container: mounted.container, results };
}

describe("StorefrontProviders session stubs", () => {
  it.each(ACTION_NAMES)(
    "reports the missing session for %s and resolves { ok: false }",
    async (name) => {
      const { container, results } = await setup();

      await interact(() =>
        query<HTMLButtonElement>(
          container,
          `[data-testid="call-${name}"]`,
        ).click(),
      );
      await vi.waitFor(() => expect(results).toHaveLength(1));

      expect(results[0]).toEqual([
        name,
        { ok: false, message: NOT_WIRED_MESSAGES.account },
      ]);
      const toasts = queryAll<HTMLParagraphElement>(container, TOAST);
      expect(toasts).toHaveLength(1);
      expect(toasts[0]?.textContent).toBe(NOT_WIRED_MESSAGES.account);
      expect(toasts[0]?.className).toContain("bg-states-warning-container");
    },
  );

  it("shows one toast per stub call", async () => {
    const { container, results } = await setup();

    for (const name of ACTION_NAMES) {
      await interact(() =>
        query<HTMLButtonElement>(
          container,
          `[data-testid="call-${name}"]`,
        ).click(),
      );
    }
    await vi.waitFor(() => expect(results).toHaveLength(3));

    expect(results.map(([name]) => name)).toEqual(ACTION_NAMES);
    expect(queryAll(container, TOAST)).toHaveLength(3);
  });
});

function AddToCartConsumer({
  onResult,
}: {
  onResult: (result: CmsActionResult) => void;
}) {
  const actions = useCmsActions();
  return (
    <button
      type="button"
      data-testid="call-add-to-cart"
      onClick={() => {
        void actions
          .addToCart({ productId: "product-1", quantity: 1 })
          .then((result) => {
            if (!result.ok && result.message) {
              actions.notify({ type: "error", message: result.message });
            }
            onResult(result);
          });
      }}
    >
      add to cart
    </button>
  );
}

describe("StorefrontProviders CMS stubs", () => {
  it("warns once and leaves no message for the island to repeat", async () => {
    const results: CmsActionResult[] = [];
    mounted = await mount(
      <StorefrontProviders>
        <AddToCartConsumer onResult={(result) => results.push(result)} />
      </StorefrontProviders>,
    );
    const { container } = mounted;

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="call-add-to-cart"]',
      ).click(),
    );
    await vi.waitFor(() => expect(results).toHaveLength(1));

    expect(results[0]).toEqual({ ok: false });
    const toasts = queryAll<HTMLParagraphElement>(container, TOAST);
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.textContent).toBe(NOT_WIRED_MESSAGES.forms);
    expect(toasts[0]?.className).toContain("bg-states-warning-container");
  });
});
