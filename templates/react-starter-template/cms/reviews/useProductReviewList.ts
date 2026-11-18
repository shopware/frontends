"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Schemas } from "#shopware";

import { useCmsActions } from "../actions/CmsActionsContext";
import type { CmsProductReviewsResult } from "../actions/CmsActionsContext";

export type UseProductReviewListInput = {
  productId?: string;
  customerId: string | null;
  open: boolean;
};

export type ProductReviewList = {
  reviews: Schemas["ProductReview"][] | null;
  loading: boolean;
  reload(): Promise<void>;
};

type LoadedReviews = {
  key: string;
  reviews: Schemas["ProductReview"][];
};

export function useProductReviewList({
  productId,
  customerId,
  open,
}: UseProductReviewListInput): ProductReviewList {
  const { loadProductReviews } = useCmsActions();
  const key = productId && customerId ? `${productId}|${customerId}` : null;
  const [loaded, setLoaded] = useState<LoadedReviews | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const requestedKey = useRef<string | null>(null);
  const latestRequest = useRef(0);

  const read = useCallback(
    async (requestKey: string, reviewsProductId: string) => {
      latestRequest.current += 1;
      const request = latestRequest.current;
      setPendingKey(requestKey);
      let result: CmsProductReviewsResult | null;
      try {
        result = await loadProductReviews({
          productId: reviewsProductId,
          page: 1,
        });
      } catch {
        result = null;
      }
      if (request !== latestRequest.current) return;
      setPendingKey(null);
      if (result?.ok && result.reviews) {
        setLoaded({ key: requestKey, reviews: result.reviews });
      }
    },
    [loadProductReviews],
  );

  useEffect(() => {
    if (!open || !productId || !key || requestedKey.current === key) return;
    requestedKey.current = key;
    void read(key, productId);
  }, [open, productId, key, read]);

  const reload = useCallback(async () => {
    if (!productId || !key) return;
    requestedKey.current = key;
    await read(key, productId);
  }, [productId, key, read]);

  return {
    reviews: loaded && loaded.key === key ? loaded.reviews : null,
    loading: key !== null && pendingKey === key,
    reload,
  };
}
