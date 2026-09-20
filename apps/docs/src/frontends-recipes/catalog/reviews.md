---
nav:
  position: 10
recipe:
  area: catalog
  status: stable
  frameworks:
    - vue
  composables:
    - useProductReviews
    - useUser
  helpers: []
  operations:
    - readProductReviews post /product/{productId}/reviews
    - readProductReviewsGet get /product/{productId}/reviews
    - saveProductReview post /product/{productId}/review
  schemas:
    - ProductReview
    - Product
    - Criteria
    - EntitySearchResult
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "UI",
    action: "Show the average first",
    detail:
      "product.ratingAverage is already on the product response. The star rating renders before any review request is made.",
    code: "product.ratingAverage",
    state: "product prop",
    typeKeys: ['Schemas["Product"]'],
  },
  {
    title: "Composable",
    action: "Load the list",
    detail:
      "loadProductReviews takes a Criteria, so paging and sorting live in the request. Ask for total-count-mode exact, or the response carries no usable total. The product id comes from the ref passed to the composable, not from an argument.",
    code: 'await loadProductReviews({ limit: 10, page: 1, "total-count-mode": "exact" })',
    state: "productReviews",
    typeKeys: ['Schemas["Criteria"]'],
  },
  {
    title: "Store API",
    action: "Return one page",
    detail:
      "POST by default, GET with the Criteria in _criteria when cacheableReads is enabled. Either way the response is an EntitySearchResult: the composable stores only elements, but returns the whole payload — which is where total lives.",
    code: "productReviews.value = data.elements ?? []",
    state: "productReviews",
    typeKeys: [
      'operations["readProductReviews post /product/{productId}/reviews"]["response"]',
      'operations["readProductReviewsGet get /product/{productId}/reviews"]["response"]',
    ],
  },
  {
    title: "UI",
    action: "Submit a review",
    detail:
      "The form collects a title, content and a rating. addReview accepts only those three, so the author name and email fall back to the logged-in customer.",
    code: "await addReview({ title, content, points })",
    state: "local form state",
    typeKeys: [
      'operations["saveProductReview post /product/{productId}/review"]["body"]',
    ],
  },
  {
    title: "Store API",
    action: "Acknowledge only",
    detail:
      "The save operation answers 200 with no body. Nothing comes back — not the created review, not the new average. A second review for the same product fails with VIOLATION::ENTITY_EXISTS.",
    code: 'apiClient.invoke("saveProductReview post /product/{productId}/review")',
    state: "sw-context-token",
    typeKeys: [],
  },
  {
    title: "UI",
    action: "Reload and label",
    detail:
      "addReview does not touch productReviews. Reload the list: the new review comes back to its author with status false, so render it behind an awaiting-approval label instead of as a published review.",
    code: "await loadProductReviews()",
    state: "productReviews",
    typeKeys: ['Schemas["ProductReview"]'],
  },
];
</script>

# Product Reviews

## Goal

Render a product's reviews and let a customer add one. The important part is that the rating average is already on the product, that the list is local to each composable instance, and that a freshly submitted review comes back flagged `status: false` until the shop approves it.

## Shopware Flow

Two read routes and one write route, and none of them is used for the star rating. `product.ratingAverage` comes with the product response, so the summary at the top of a detail page needs no request at all.

`readProductReviews post /product/{productId}/reviews` takes a `Criteria` and returns one page of reviews. When the app enables `cacheableReads`, the composable calls the cacheable GET twin instead — `readProductReviewsGet get /product/{productId}/reviews` — with the same Criteria compressed into the `_criteria` query parameter. `vue-starter-template` sets `cacheableReads: true`, so an app started from it takes the GET path.

`saveProductReview post /product/{productId}/review` answers `200` with no body — it returns neither the created review nor an updated average. Both facts shape the handler: after a successful submit there is nothing to merge, so you reload, and what comes back is your own review marked as not yet approved.

<RecipeFlowDiagram label="Product reviews flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The page renders `product.ratingAverage` from data it already has.
2. `loadProductReviews(criteria)` requests one page for the product the composable was created with.
3. The Store API answers with an `EntitySearchResult`; the composable keeps `elements` and returns the rest.
4. The form calls `addReview({ title, content, points })`.
5. The Store API answers `200` with no body.
6. The handler reloads the list and labels the new, unapproved review.

You do not need a request for the average rating, and you do not need to pass the product id to either method — the composable takes the product ref once.

## Request Flow

| Step                  | Code                                                                | Store API                                      | Type                                                                                                            |
| --------------------- | ------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Read the average      | `product.ratingAverage`                                             | none                                           | <SchemaTypeTooltip type-key='Schemas["Product"]' />                                                             |
| Load one page         | `loadProductReviews({ limit: 10 })`                                 | `POST /product/{productId}/reviews`            | <SchemaTypeTooltip type-key='operations["readProductReviews post /product/{productId}/reviews"]["body"]' />     |
| …with cacheable reads | `loadProductReviews({ limit: 10 })`                                 | `GET /product/{productId}/reviews?_criteria=…` | <SchemaTypeTooltip type-key='Schemas["Criteria"]' />                                                            |
| Read the page         | `productReviews`                                                    | either read route                              | <SchemaTypeTooltip type-key='operations["readProductReviews post /product/{productId}/reviews"]["response"]' /> |
| Read the total        | `(await loadProductReviews({ "total-count-mode": "exact" })).total` | either read route                              | <SchemaTypeTooltip type-key='Schemas["EntitySearchResult"]' />                                                  |
| Submit a review       | `addReview({ title, content, points })`                             | `POST /product/{productId}/review`             | <SchemaTypeTooltip type-key='operations["saveProductReview post /product/{productId}/review"]["body"]' />       |
| Read the result       | none                                                                | `POST /product/{productId}/review`             | none — the operation answers `200` with no body                                                                 |

Two things about the total row. It goes through the method's **return value**, not through a reactive property — the composable stores only `elements`, so pagination controls have to keep the total themselves. And `total-count-mode` defaults to `none`, which means "do not count": without asking for `exact` you get no number to paginate with.

The POST and the GET route are the same request in two shapes. `useProductReviews` picks between them from `cacheableReads` in the Shopware context; your calling code does not change.

## Composables

- `useProductReviews`: takes a `Ref<Product>`. Exposes `productReviews`, `loadProductReviews(criteria)` and `addReview({ title, content, points })`. The backing ref is created per instance, so it is not shared between components, and it is exposed as a read-only `ComputedRef` — only `loadProductReviews` writes to it.
- `useUser`: `isLoggedIn` and `user` decide whether to render the form. `addReview` cannot set the author, so it only makes sense for a customer session.

`vue-starter-template` renders no review UI of its own. The working reference is `@shopware/cms-base-layer`, which ships `SwProductReviews` and `SwProductReviewsForm` and wires them together in `CmsElementProductDescriptionReviews`.

## Types

Use generated Store API types when you need to type the criteria, the review, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readProductReviews post /product/{productId}/reviews"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readProductReviews post /product/{productId}/reviews"]["response"]' />
  <SchemaTypeTooltip type-key='operations["readProductReviewsGet get /product/{productId}/reviews"]["response"]' />
  <SchemaTypeTooltip type-key='operations["saveProductReview post /product/{productId}/review"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["ProductReview"]' />
  <SchemaTypeTooltip type-key='Schemas["Criteria"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type ReviewsCriteria =
  operations["readProductReviews post /product/{productId}/reviews"]["body"];
type ReviewsResponse =
  operations["readProductReviews post /product/{productId}/reviews"]["response"];
type SaveReviewBody =
  operations["saveProductReview post /product/{productId}/review"]["body"];
type ProductReview = Schemas["ProductReview"];
```

`SaveReviewBody` is wider than what `addReview` accepts: alongside the required `title`, `content` and `points` it also takes `name` and `email`, documented as defaulting to the customer's own. Reaching those means calling `apiClient.invoke` directly.

## Minimal Vue Example

<CodeExample title="Minimal product reviews section">

```vue
<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { Schemas } from "#shopware";

const { product } = defineProps<{ product: Schemas["Product"] }>();

const { productReviews, loadProductReviews, addReview } = useProductReviews(
  toRef(() => product),
);
const { isLoggedIn } = useUser();

const PER_PAGE = 10;

const total = ref(0);
const currentPage = ref(1);
const isLoading = ref(true);
const isSubmitting = ref(false);
const loadError = ref("");
const submitError = ref("");
const hasSubmitted = ref(false);

const form = reactive({ title: "", content: "", points: 5 });

const totalPages = computed(() => Math.ceil(total.value / PER_PAGE));

const loadReviews = async (page: number) => {
  loadError.value = "";
  isLoading.value = true;

  try {
    const result = await loadProductReviews({
      limit: PER_PAGE,
      page,
      "total-count-mode": "exact",
    });
    total.value = result.total ?? 0;
    currentPage.value = page;
  } catch (error) {
    console.error(error);
    loadError.value = "The reviews could not be loaded.";
  } finally {
    isLoading.value = false;
  }
};

const goToPage = (page: number) => {
  if (isLoading.value) return;
  loadReviews(page);
};

onMounted(() => loadReviews(1));

const submitReview = async () => {
  if (isSubmitting.value) return;

  submitError.value = "";
  hasSubmitted.value = false;
  isSubmitting.value = true;

  try {
    await addReview(form);
    hasSubmitted.value = true;
    form.title = "";
    form.content = "";
    form.points = 5;

    await loadReviews(1);

    if (loadError.value) {
      loadError.value =
        "Your review was submitted, but the list could not be refreshed.";
    }
  } catch (error) {
    console.error(error);

    const alreadyReviewed =
      error instanceof ApiClientError &&
      error.details?.errors?.some(
        (apiError) => apiError.code === "VIOLATION::ENTITY_EXISTS",
      );

    submitError.value = alreadyReviewed
      ? "You have already reviewed this product."
      : "Your review could not be submitted.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section>
    <h2>Reviews</h2>

    <p v-if="product.ratingAverage">
      {{ product.ratingAverage.toFixed(1) }} out of 5
    </p>

    <div aria-live="polite" :aria-busy="isLoading">
      <p v-if="isLoading">Loading reviews…</p>

      <div v-else-if="loadError" role="alert">
        <p>{{ loadError }}</p>
        <button type="button" @click="loadReviews(currentPage)">
          Try again
        </button>
      </div>

      <p v-else-if="!productReviews.length">This product has no reviews yet.</p>

      <ol v-else>
        <li v-for="review in productReviews" :key="review.id">
          <h3>{{ review.title }}</h3>
          <p v-if="!review.status">Your review has not been approved yet.</p>
          <p>{{ review.points ?? 0 }} out of 5</p>
          <p>{{ review.content }}</p>
          <p v-if="review.externalUser">{{ review.externalUser }}</p>
          <p v-if="review.comment">Shop reply: {{ review.comment }}</p>
        </li>
      </ol>
    </div>

    <nav v-if="totalPages > 1" aria-label="Reviews pagination">
      <button
        type="button"
        :disabled="isLoading || currentPage <= 1"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        type="button"
        :disabled="isLoading || currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </nav>
  </section>

  <section v-if="isLoggedIn">
    <h2>Write a review</h2>

    <p v-if="hasSubmitted" role="status">
      Thank you. Your review will appear to everyone once it has been approved.
    </p>

    <form v-else @submit.prevent="submitReview">
      <p v-if="submitError" role="alert">{{ submitError }}</p>

      <label>
        Rating
        <select v-model.number="form.points">
          <option
            v-for="points in [5, 4, 3, 2, 1]"
            :key="points"
            :value="points"
          >
            {{ points }}
          </option>
        </select>
      </label>

      <label>
        Title
        <input v-model="form.title" type="text" required />
      </label>

      <label>
        Your review
        <textarea v-model="form.content" required />
      </label>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Submitting…" : "Submit my review" }}
      </button>
    </form>
  </section>

  <p v-else>Sign in to write a review.</p>
</template>
```

</CodeExample>

## State And Session

The reviews array is a `ref([])` created inside each `useProductReviews()` call, never provided, and handed out as a read-only `ComputedRef`. Two components on the same page each hold their own copy and each issue their own request — unlike the cart or the session context, nothing here is shared, and nothing but `loadProductReviews` can write to it.

The write depends on the session. `saveProductReview` documents `name` and `email` as defaulting to the customer's, and `addReview` does not expose either, so the operation is meant for a logged-in customer. Rendering the form behind `isLoggedIn` avoids a rejection the visitor cannot act on. The same session decides what the read returns: the list operation returns your own unapproved review to you, which is why the base layer renders an approval notice inside the list at all.

Reviews carry a `status` and a `comment`. `status` is the moderation flag — `false` means the review is waiting for approval, so it is on you to label it rather than render it as published. `comment` holds the shop's reply to the review; the Store API schema describes it as review content, but the base layer renders it as shop feedback and that is what it is.

## Edge Cases

- `addReview` does not update `productReviews` and returns `void`. Reload the list yourself.
- A reloaded list contains the customer's own unapproved review with `status: false`. Render an awaiting-approval label for it rather than presenting it as published.
- `product.ratingAverage` is a server-side aggregate and does not change when a review is submitted. Do not recompute it from the loaded page.
- A customer can review a product once. A second `addReview` rejects with `VIOLATION::ENTITY_EXISTS`, which deserves its own message rather than a generic failure.
- The list is one page. `productReviews` holds `elements` only, so `total` has to be read from the value `loadProductReviews()` resolves to — and only if the Criteria asked for it.
- `total-count-mode` defaults to `none`. Without `"total-count-mode": "exact"` the response carries no usable total and every page looks like the last one.
- With `cacheableReads` enabled the composable calls `GET /product/{productId}/reviews` and sends the Criteria in `_criteria`. Anything asserting on the request — a test, a mock, a network expectation — has to cover the shape the app actually uses.
- `loadProductReviews` reads `product.value.id` at call time. A product ref that is still `undefined` throws before any request is sent; a product object without an `id` sends one against `/product/undefined/reviews`.
- `addReview` accepts only `title`, `content` and `points`. Setting the author's `name` or `email` — for example for a guest review — means calling `apiClient.invoke` with the full body.
- `points` is a `double` in the save body and a `float` on the review, not an integer. A half-star UI is possible on the API side.
- The save body requires `title`, `content` and `points`; `name` and `email` are the optional ones. A returned `ProductReview` guarantees `id`, `productId`, `salesChannelId`, `languageId`, `title` and `content`; of the fields you actually render, `points`, `status`, `comment` and `externalUser` are all optional, so guard them before formatting.
- `review.externalUser` is the display name and is optional, so a review can render without an author.
- The list is fetched on mount, so it is absent from server-rendered and ISR-cached HTML. That matches `CmsElementProductDescriptionReviews` in the base layer, but it means crawlers see `product.ratingAverage` and no review text.
- Each `useProductReviews()` instance fetches independently. A summary block and a full list on one page make two identical requests unless you share the result yourself.

## Common Mistakes

- Do not present a freshly submitted review as published. It comes back with `status: false`.
- Do not recompute the average from the reviews you loaded. Use `product.ratingAverage`.
- Do not expect `productReviews` to be shared between components, or to be writable.
- Do not render the review form for an anonymous visitor.
- Do not read the total from `productReviews.length`. That is one page.
- Do not request a total without `"total-count-mode": "exact"`.
- Do not assert on `POST /product/{productId}/reviews` in an app that enables `cacheableReads`.
- Do not call `loadProductReviews()` before the product ref is populated.
- Do not use `addReview` when you need to set the author name — invoke the operation directly.
- Do not treat a duplicate-review rejection as an unknown error.
- Do not render `review.comment` as customer content. It is the shop's reply.

## Testing Checklist

- The rating average renders before any review request resolves.
- Opening the page issues one review request for the product — `readProductReviews post /product/{productId}/reviews`, or `readProductReviewsGet get /product/{productId}/reviews` with a `_criteria` query when `cacheableReads` is enabled.
- The criteria carries the page size and `total-count-mode: exact`.
- The total used for pagination comes from the method's return value.
- Paging forward issues one request per page and replaces the rendered reviews.
- A product with no reviews renders an empty state.
- Submitting a review calls `saveProductReview post /product/{productId}/review` with `title`, `content` and `points`.
- After a successful submit the list is reloaded and the customer's own review renders with an awaiting-approval label.
- A duplicate submit shows the already-reviewed message, not the generic one.
- A rejected submit shows a UI-level error and keeps the entered text.
- The form is not rendered for a logged-out visitor.

## Related Links

- [Product detail page](../../getting-started/e-commerce/product-detail-page.html)
- [Login recipe](../account/login.html)
- [Caching best practices](../../best-practices/caching.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
