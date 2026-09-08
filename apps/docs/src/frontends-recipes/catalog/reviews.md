---
nav:
  position: 50
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
      "loadProductReviews takes a Criteria, so paging and sorting live in the request. The product id comes from the ref passed to the composable, not from an argument.",
    code: "await loadProductReviews({ limit: 10, page: 1 })",
    state: "productReviews",
    typeKeys: [
      'operations["readProductReviews post /product/{productId}/reviews"]["body"]',
    ],
  },
  {
    title: "Store API",
    action: "Return one page",
    detail:
      "The response is an EntitySearchResult. The composable stores only elements, but returns the whole payload — which is where total lives.",
    code: "productReviews.value = data.elements ?? []",
    state: "local ref",
    typeKeys: [
      'operations["readProductReviews post /product/{productId}/reviews"]["response"]',
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
      "The save operation answers 200 with no body. Nothing comes back — not the created review, not the new average.",
    code: 'apiClient.invoke("saveProductReview post /product/{productId}/review")',
    state: "sw-context-token",
    typeKeys: [],
  },
  {
    title: "UI",
    action: "Reload and explain",
    detail:
      "addReview does not touch productReviews. Reload the list, and tell the customer their review is awaiting approval — a moderated review is not in the response yet.",
    code: "await loadProductReviews()",
    state: "productReviews",
    typeKeys: ['Schemas["ProductReview"]'],
  },
];
</script>

# Product Reviews

## Goal

Render a product's reviews and let a customer add one. The important part is that the rating average is already on the product, that the list is local to each composable instance, and that a submitted review does not appear in the list — reviews are moderated.

## Shopware Flow

Two operations, and neither one is used for the star rating. `product.ratingAverage` comes with the product response, so the summary at the top of a detail page needs no request at all.

`readProductReviews post /product/{productId}/reviews` takes a `Criteria` and returns one page of reviews. `saveProductReview post /product/{productId}/review` answers `200` with no body — it returns neither the created review nor an updated average. Both facts shape the handler: after a successful submit there is nothing to merge, and reloading may still not show the review.

<RecipeFlowDiagram label="Product reviews flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The page renders `product.ratingAverage` from data it already has.
2. `loadProductReviews(criteria)` requests one page for the product the composable was created with.
3. The response is an `EntitySearchResult`; the composable keeps `elements` and returns the rest.
4. The form calls `addReview({ title, content, points })`.
5. The Store API answers `200` with no body.
6. The handler reloads the list and tells the customer the review is awaiting approval.

You do not need a request for the average rating, and you do not need to pass the product id to either method — the composable takes the product ref once.

## Request Flow

| Step             | Code                                    | Store API                           | Type                                                                                                            |
| ---------------- | --------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Read the average | `product.ratingAverage`                 | none                                | <SchemaTypeTooltip type-key='Schemas["Product"]' />                                                             |
| Load one page    | `loadProductReviews({ limit: 10 })`     | `POST /product/{productId}/reviews` | <SchemaTypeTooltip type-key='operations["readProductReviews post /product/{productId}/reviews"]["body"]' />     |
| Read the page    | `productReviews`                        | `POST /product/{productId}/reviews` | <SchemaTypeTooltip type-key='operations["readProductReviews post /product/{productId}/reviews"]["response"]' /> |
| Read the total   | `(await loadProductReviews()).total`    | `POST /product/{productId}/reviews` | <SchemaTypeTooltip type-key='Schemas["EntitySearchResult"]' />                                                  |
| Submit a review  | `addReview({ title, content, points })` | `POST /product/{productId}/review`  | <SchemaTypeTooltip type-key='operations["saveProductReview post /product/{productId}/review"]["body"]' />       |
| Read the result  | none                                    | `POST /product/{productId}/review`  | none — the operation answers `200` with no body                                                                 |

The total row goes through the method's **return value**, not through a reactive property. The composable stores only `elements`, so pagination controls have to keep the total themselves.

## Composables

- `useProductReviews`: takes a `Ref<Product>`. Exposes `productReviews`, `loadProductReviews(criteria)` and `addReview({ title, content, points })`. The reviews ref is created per instance, so it is not shared between components.
- `useUser`: `isLoggedIn` and `user` decide whether to render the form. `addReview` cannot set the author, so it only makes sense for a customer session.

## Types

Use generated Store API types when you need to type the criteria, the review, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readProductReviews post /product/{productId}/reviews"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readProductReviews post /product/{productId}/reviews"]["response"]' />
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

```vue
<script setup lang="ts">
import type { Schemas } from "#shopware";

const { product } = defineProps<{ product: Schemas["Product"] }>();

const { productReviews, loadProductReviews, addReview } = useProductReviews(
  toRef(() => product)
);
const { isLoggedIn } = useUser();

const PER_PAGE = 10;

const total = ref(0);
const page = ref(1);
const isLoading = ref(true);
const isSubmitting = ref(false);
const reviewError = ref("");
const submitted = ref(false);

const form = reactive({ title: "", content: "", points: 5 });

const totalPages = computed(() => Math.ceil(total.value / PER_PAGE));

const loadPage = async (nextPage: number) => {
  reviewError.value = "";
  isLoading.value = true;

  try {
    // total only exists on the return value, not on a reactive property
    const result = await loadProductReviews({
      limit: PER_PAGE,
      page: nextPage,
    });
    total.value = result.total ?? 0;
    page.value = nextPage;
  } catch {
    reviewError.value = "The reviews could not be loaded.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => loadPage(1));

const submitReview = async () => {
  reviewError.value = "";
  isSubmitting.value = true;

  try {
    await addReview(form);
    submitted.value = true;
    form.title = "";
    form.content = "";
    form.points = 5;

    // the save returns nothing, and a moderated review is not in the list yet
    await loadPage(1);
  } catch {
    reviewError.value = "Your review could not be submitted.";
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

    <p v-if="reviewError">{{ reviewError }}</p>

    <p v-if="isLoading">Loading reviews…</p>

    <p v-else-if="!productReviews.length">
      This product has no published reviews yet.
    </p>

    <ol v-else>
      <li v-for="review in productReviews" :key="review.id">
        <h3>{{ review.title }}</h3>
        <p>{{ review.points }} out of 5</p>
        <p>{{ review.content }}</p>
        <p v-if="review.externalUser">{{ review.externalUser }}</p>
        <p v-if="review.comment">Shop reply: {{ review.comment }}</p>
      </li>
    </ol>

    <nav v-if="totalPages > 1">
      <button type="button" :disabled="page <= 1" @click="loadPage(page - 1)">
        Previous
      </button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button
        type="button"
        :disabled="page >= totalPages"
        @click="loadPage(page + 1)"
      >
        Next
      </button>
    </nav>
  </section>

  <section v-if="isLoggedIn">
    <h2>Write a review</h2>

    <p v-if="submitted">
      Thank you. Your review will appear once it has been approved.
    </p>

    <form @submit.prevent="submitReview">
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

## State And Session

`productReviews` is a plain `ref([])` created inside each `useProductReviews()` call and never provided. Two components on the same page each hold their own copy and each issue their own request — unlike the cart or the session context, nothing here is shared.

The write depends on the session. `saveProductReview` documents `name` and `email` as defaulting to the customer's, and `addReview` does not expose either, so the operation is meant for a logged-in customer. Rendering the form behind `isLoggedIn` avoids a rejection the visitor cannot act on.

Reviews carry a `status` and a `comment`. Reviews returned by the list operation are the published ones, and a shop reply arrives as `comment` on the review itself rather than as a nested entity.

## Edge Cases

- `addReview` does not update `productReviews` and returns `void`. Reload the list yourself.
- Reloading after a submit usually does **not** show the new review, because it awaits moderation. Tell the customer that instead of letting them wonder.
- `product.ratingAverage` is a server-side aggregate and does not change when a review is submitted. Do not recompute it from the loaded page.
- The list is one page. `productReviews` holds `elements` only, so `total` has to be read from the value `loadProductReviews()` resolves to.
- `loadProductReviews` reads `product.value.id` at call time. Passing a product ref that is still `undefined` sends a request against `/product/undefined/reviews`.
- `addReview` accepts only `title`, `content` and `points`. Setting the author's `name` or `email` — for example for a guest review — means calling `apiClient.invoke` with the full body.
- `points` is a `double` in the schema, not an integer. A half-star UI is possible on the API side.
- `title` and `content` are required by both the schema and the composable's type. `name` and `email` are not.
- `review.externalUser` is the display name and is optional, so a review can render without an author.
- Each `useProductReviews()` instance fetches independently. A summary block and a full list on one page make two identical requests unless you share the result yourself.

## Common Mistakes

- Do not assume a submitted review appears in the list.
- Do not recompute the average from the reviews you loaded. Use `product.ratingAverage`.
- Do not expect `productReviews` to be shared between components.
- Do not render the review form for an anonymous visitor.
- Do not read the total from `productReviews.length`. That is one page.
- Do not call `loadProductReviews()` before the product ref is populated.
- Do not use `addReview` when you need to set the author name — invoke the operation directly.
- Do not render `review.comment` as customer content. It is the shop's reply.

## Testing Checklist

- The rating average renders before any review request resolves.
- Opening the page calls `readProductReviews post /product/{productId}/reviews` once with the page size in the criteria.
- The total used for pagination comes from the method's return value.
- Paging forward issues one request per page and replaces the rendered reviews.
- A product with no published reviews renders an empty state.
- Submitting a review calls `saveProductReview post /product/{productId}/review` with `title`, `content` and `points`.
- After a successful submit the list is reloaded and the customer is told the review awaits approval.
- A rejected submit shows a UI-level error and keeps the entered text.
- The form is not rendered for a logged-out visitor.

## Related Links

- [Product detail page](../../getting-started/e-commerce/product-detail-page.html)
- [Login recipe](../account/login.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
