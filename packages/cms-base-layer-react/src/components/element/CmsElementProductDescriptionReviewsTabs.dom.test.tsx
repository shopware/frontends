import { Activity, StrictMode } from "react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";

import {
  deferred,
  interact,
  mount,
  query,
  setFieldValue,
  submitForm,
} from "../../__fixtures__/dom";
import type { Mounted } from "../../__fixtures__/dom";
import { CmsActionsProvider } from "../../actions/CmsActionsContext";
import type {
  CmsActions,
  CmsCustomerState,
  CmsProductReviewsResult,
} from "../../actions/CmsActionsContext";
import { CmsElementProductDescriptionReviewsTabs } from "./CmsElementProductDescriptionReviewsTabs";
import type { CmsElementProductDescriptionReviewsTabsProps } from "./CmsElementProductDescriptionReviewsTabs";

const TAB = '[data-testid="product-reviews-tab"]';
const SERVER_REVIEWS = '[data-testid="server-reviews"]';
const SUBMIT = '[data-testid="review-submit-button"]';
const LOGIN_HINT = "Please log in to write a review";
const NOT_APPROVED = "Your review has not been approved yet";
const THANK_YOU = "Thank you for submitting your review";

const translations: CmsElementProductDescriptionReviewsTabsProps["translations"] =
  {
    product: {
      description: "Description",
      reviews: "Reviews",
      messages: {
        reviewAdded: THANK_YOU,
        loginToReview: LOGIN_HINT,
      },
    },
    errors: {},
  };

const GUEST: CmsCustomerState = { status: "guest" };
const LOADING: CmsCustomerState = { status: "loading" };

function customer(customerId = "customer-1"): CmsCustomerState {
  return { status: "customer", customerId };
}

function review(
  overrides: Partial<Schemas["ProductReview"]> = {},
): Schemas["ProductReview"] {
  return {
    id: "review-1",
    productId: "variant-1",
    salesChannelId: "sales-channel-1",
    languageId: "language-1",
    title: "Solid chair",
    content: "Sturdy and comfortable for long working days at the desk.",
    points: 4,
    status: true,
    createdAt: "2026-10-01T10:00:00.000Z",
    ...overrides,
  };
}

const approved = review();
const pending = review({
  id: "review-2",
  title: "My own review",
  status: false,
});

type Load = CmsActions["loadProductReviews"];

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
  vi.restoreAllMocks();
});

type SetupOptions = {
  customer?: CmsCustomerState | null;
  isLoggedIn?: boolean;
  reviewsProductId?: string | null;
  load?: Load;
  strict?: boolean;
};

async function setup({
  customer: initialCustomer = customer(),
  isLoggedIn = false,
  reviewsProductId = "parent-1",
  load = async () => ({ ok: true, reviews: [approved, pending] }),
  strict = false,
}: SetupOptions = {}) {
  const notify = vi.fn();
  const loadProductReviews = vi.fn(load);
  const submitProductReview = vi.fn<CmsActions["submitProductReview"]>(
    async () => ({ ok: true }),
  );

  const current: { state: CmsCustomerState | null; hidden: boolean } = {
    state: initialCustomer,
    hidden: false,
  };

  function tree({ state, hidden }: typeof current): ReactNode {
    const element = (
      <CmsActionsProvider
        actions={{
          notify,
          loadProductReviews,
          submitProductReview,
          getCustomerState: () => state,
        }}
      >
        <CmsElementProductDescriptionReviewsTabs
          productId="variant-1"
          reviewsProductId={reviewsProductId ?? undefined}
          initialReviewCount={1}
          isLoggedIn={isLoggedIn}
          locale="en-GB"
          translations={translations}
          description={<p>Description text</p>}
          reviews={<div data-testid="server-reviews">Server reviews</div>}
          categories={null}
        />
      </CmsActionsProvider>
    );
    const shown = (
      <Activity mode={hidden ? "hidden" : "visible"}>{element}</Activity>
    );
    return strict ? <StrictMode>{shown}</StrictMode> : shown;
  }

  const view = await mount(tree(current));
  mounted = view;
  const { container } = view;
  const tab = () => query<HTMLButtonElement>(container, TAB);

  return {
    container,
    notify,
    loadProductReviews,
    submitProductReview,
    tab,
    header: () => tab().textContent,
    openReviews: () => interact(() => tab().click()),
    setCustomer: (state: CmsCustomerState | null) => {
      current.state = state;
      return view.rerender(tree(current));
    },
    setHidden: (hidden: boolean) => {
      current.hidden = hidden;
      return view.rerender(tree(current));
    },
    hasServerReviews: () => container.querySelector(SERVER_REVIEWS) !== null,
    text: () => container.textContent ?? "",
  };
}

async function fillAndSubmit(container: HTMLElement) {
  await interact(() =>
    query<HTMLButtonElement>(
      container,
      'button[aria-label="Rate 5 out of 5 stars"]',
    ).click(),
  );
  await interact(() => {
    setFieldValue(
      query<HTMLInputElement>(container, '[data-testid="review-title-input"]'),
      "Great chair",
    );
    setFieldValue(
      query<HTMLTextAreaElement>(
        container,
        '[data-testid="review-text-input"]',
      ),
      "Comfortable, sturdy and easy to assemble in under ten minutes.",
    );
  });
  await interact(() => submitForm(query<HTMLFormElement>(container, "form")));
}

describe("CmsElementProductDescriptionReviewsTabs", () => {
  it("shows a guest the login hint and reads nothing, even with the tab open", async () => {
    const view = await setup({ customer: GUEST });

    await view.openReviews();

    expect(view.text()).toContain(LOGIN_HINT);
    expect(view.container.querySelector(SUBMIT)).toBeNull();
    expect(view.hasServerReviews()).toBe(true);
    expect(view.loadProductReviews).not.toHaveBeenCalled();
  });

  it("renders neither the form nor the hint while the session loads", async () => {
    const view = await setup({ customer: LOADING });

    await view.openReviews();

    expect(view.text()).not.toContain(LOGIN_HINT);
    expect(view.container.querySelector(SUBMIT)).toBeNull();
    expect(view.loadProductReviews).not.toHaveBeenCalled();
  });

  it("reads the parent's reviews once when a customer opens the tab and replaces the server list", async () => {
    const view = await setup();

    expect(view.loadProductReviews).not.toHaveBeenCalled();
    expect(view.header()).toBe("Reviews (1)");

    await view.openReviews();

    expect(view.loadProductReviews).toHaveBeenCalledTimes(1);
    expect(view.loadProductReviews).toHaveBeenCalledWith({
      productId: "parent-1",
      page: 1,
    });
    expect(view.hasServerReviews()).toBe(false);
    expect(view.text()).toContain("My own review");
    expect(view.text()).toContain(NOT_APPROVED);
    expect(view.header()).toBe("Reviews (2)");
    expect(view.container.querySelector(SUBMIT)).not.toBeNull();

    await interact(() => view.tab().click());
    await view.openReviews();

    expect(view.loadProductReviews).toHaveBeenCalledTimes(1);
  });

  it("marks the reviews busy while the read is pending", async () => {
    const read = deferred<CmsProductReviewsResult>();
    const view = await setup({ load: () => read.promise });

    await view.openReviews();

    expect(view.container.querySelector('[aria-busy="true"]')).not.toBeNull();

    await interact(() => read.resolve({ ok: true, reviews: [approved] }));

    expect(view.container.querySelector('[aria-busy="true"]')).toBeNull();
  });

  it.each([
    ["resolves ok: false", async () => ({ ok: false })],
    [
      "rejects",
      async () => {
        throw new Error("offline");
      },
    ],
  ] satisfies [string, Load][])(
    "keeps the server list without a notification when the read %s",
    async (_, load) => {
      const view = await setup({ load });

      await view.openReviews();

      expect(view.loadProductReviews).toHaveBeenCalledTimes(1);
      expect(view.hasServerReviews()).toBe(true);
      expect(view.header()).toBe("Reviews (1)");
      expect(view.notify).not.toHaveBeenCalled();
    },
  );

  it("ignores a read that settles after a logout and shows the server list again", async () => {
    const read = deferred<CmsProductReviewsResult>();
    const view = await setup({ load: () => read.promise });
    await view.openReviews();

    await view.setCustomer(GUEST);
    await interact(() => read.resolve({ ok: true, reviews: [pending] }));

    expect(view.hasServerReviews()).toBe(true);
    expect(view.text()).not.toContain(NOT_APPROVED);
    expect(view.text()).toContain(LOGIN_HINT);
    expect(view.header()).toBe("Reviews (1)");
  });

  it("ignores the first customer's read once another customer is signed in", async () => {
    const first = deferred<CmsProductReviewsResult>();
    const second = deferred<CmsProductReviewsResult>();
    const reads = [first, second];
    const view = await setup({
      load: () => (reads.shift() ?? second).promise,
    });
    await view.openReviews();

    await view.setCustomer(customer("customer-2"));
    await interact(() =>
      second.resolve({
        ok: true,
        reviews: [approved, review({ id: "review-3", title: "Second" })],
      }),
    );
    await interact(() => first.resolve({ ok: true, reviews: [pending] }));

    expect(view.loadProductReviews).toHaveBeenCalledTimes(2);
    expect(view.text()).toContain("Second");
    expect(view.text()).not.toContain("My own review");
    expect(view.header()).toBe("Reviews (2)");
  });

  it("saves the review under the product id and reads the list again", async () => {
    const view = await setup();
    await view.openReviews();

    await fillAndSubmit(view.container);

    expect(view.submitProductReview).toHaveBeenCalledWith({
      productId: "variant-1",
      title: "Great chair",
      content: "Comfortable, sturdy and easy to assemble in under ten minutes.",
      points: 5,
    });
    await vi.waitFor(() =>
      expect(view.loadProductReviews).toHaveBeenCalledTimes(2),
    );
    expect(view.loadProductReviews).toHaveBeenLastCalledWith({
      productId: "parent-1",
      page: 1,
    });
    expect(view.text()).toContain(THANK_YOU);
    expect(view.container.querySelector(SUBMIT)).toBeNull();
    expect(view.notify).not.toHaveBeenCalled();
  });

  it("does not show the thank-you message to the next customer", async () => {
    const view = await setup();
    await view.openReviews();
    await fillAndSubmit(view.container);
    await vi.waitFor(() => expect(view.text()).toContain(THANK_YOU));

    await view.setCustomer(customer("customer-2"));

    expect(view.text()).not.toContain(THANK_YOU);
    expect(view.container.querySelector(SUBMIT)).not.toBeNull();
  });

  it("reads nothing when the slot carries no reviews", async () => {
    const view = await setup({ reviewsProductId: null });
    await view.openReviews();

    expect(view.container.querySelector(SUBMIT)).not.toBeNull();

    await fillAndSubmit(view.container);

    await vi.waitFor(() => expect(view.text()).toContain(THANK_YOU));
    expect(view.loadProductReviews).not.toHaveBeenCalled();
    expect(view.hasServerReviews()).toBe(true);
  });

  it("falls back to ctx.isLoggedIn when the app tracks no customer state", async () => {
    const view = await setup({ customer: null, isLoggedIn: true });
    await view.openReviews();

    expect(view.container.querySelector(SUBMIT)).not.toBeNull();
    expect(view.loadProductReviews).toHaveBeenCalledTimes(1);
    expect(view.text()).not.toContain(LOGIN_HINT);
  });

  it("shows the hint when the app tracks no customer state and ctx is anonymous", async () => {
    const view = await setup({ customer: null });
    await view.openReviews();

    expect(view.text()).toContain(LOGIN_HINT);
    expect(view.loadProductReviews).not.toHaveBeenCalled();
  });

  it("does not read again when the page comes back from a hidden Activity", async () => {
    const read = deferred<CmsProductReviewsResult>();
    const view = await setup({ load: () => read.promise });
    await view.openReviews();

    await view.setHidden(true);
    await interact(() => read.resolve({ ok: true, reviews: [pending] }));
    await view.setHidden(false);

    expect(view.loadProductReviews).toHaveBeenCalledTimes(1);
    expect(view.text()).toContain(NOT_APPROVED);
    expect(view.container.querySelector('[aria-busy="true"]')).toBeNull();
  });

  it("loads the list with one request under StrictMode", async () => {
    const view = await setup({ strict: true });

    await view.openReviews();

    expect(view.loadProductReviews).toHaveBeenCalledTimes(1);
    expect(view.text()).toContain("My own review");
    expect(view.header()).toBe("Reviews (2)");
  });
});
