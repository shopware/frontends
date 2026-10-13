"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import { useCallback, useEffect, useId, useRef } from "react";
import type { Ref } from "react";

import type { Schemas } from "#shopware";
import { LocaleLink } from "@/components/LocaleLink";
import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import { PageSizeSelector } from "@/features/paging/components/PageSizeSelector";
import { Pagination } from "@/features/paging/components/Pagination";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "@/features/paging/pagination";
import { scrollToList } from "@/features/paging/scrollToList";
import { usePagedList } from "@/features/paging/usePagedList";
import type { PagedListRead } from "@/features/paging/usePagedList";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useSession } from "@/features/session/components/SessionProvider";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";

import {
  CUSTOMER_NOT_LOGGED_IN,
  hasApiErrorCode,
  readWishlistPage,
} from "../wishlistApi";
import {
  WishlistProductTile,
  WishlistProductTileSkeleton,
} from "./WishlistProductTile";

const GRID_CLASS =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

const MAX_SKELETONS = 4;

const LINK_BUTTON_CLASS =
  "inline-flex min-h-12 items-center justify-center rounded-md px-6 py-3 text-base font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-outline-focus";

const PRIMARY_LINK_CLASS = `${LINK_BUTTON_CLASS} bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover`;

const SECONDARY_LINK_CLASS = `${LINK_BUTTON_CLASS} bg-brand-secondary text-brand-on-secondary hover:bg-brand-secondary-hover`;

const FAILURE_MESSAGE = "[Wishlist] reading the wishlist failed";

function SkeletonGrid({ count }: { count: number }) {
  const t = useTranslations();
  return (
    <div aria-busy="true">
      <output className="sr-only">{t("listing.loading")}</output>
      <ul className={GRID_CLASS}>
        {Array.from({ length: Math.min(count, MAX_SKELETONS) }, (_, index) => (
          <WishlistProductTileSkeleton key={index} />
        ))}
      </ul>
    </div>
  );
}

function WishlistHeader({
  headingRef,
}: {
  headingRef?: Ref<HTMLHeadingElement>;
}) {
  const t = useTranslations();
  return (
    <AccountPageHeader
      className="mb-14"
      title={t("wishlist.header")}
      subtitle={t("wishlist.subHeader")}
      headingRef={headingRef}
    />
  );
}

function NotLoggedIn() {
  const t = useTranslations();
  const localePath = useLocalePath();
  const login = `/account/login?redirect=${encodeURIComponent(localePath("/wishlist"))}`;

  return (
    <div className="flex flex-col items-start gap-8">
      <AccountPageHeader
        title={t("wishlist.notLoggedIn.title")}
        subtitle={t("wishlist.notLoggedIn.description")}
      />
      <div className="flex flex-wrap gap-4">
        <LocaleLink href={login} className={PRIMARY_LINK_CLASS}>
          {t("wishlist.notLoggedIn.login")}
        </LocaleLink>
        <LocaleLink
          href={`${login}#registration`}
          className={SECONDARY_LINK_CLASS}
        >
          {t("wishlist.notLoggedIn.register")}
        </LocaleLink>
        <LocaleLink href="/" className={SECONDARY_LINK_CLASS}>
          {t("wishlist.notLoggedIn.continueShopping")}
        </LocaleLink>
      </div>
    </div>
  );
}

function EmptyWishlist({
  headingRef,
}: {
  headingRef?: Ref<HTMLHeadingElement>;
}) {
  const t = useTranslations();
  return (
    <div
      data-testid="wishlist-empty-container"
      className="flex flex-col items-start gap-8"
    >
      <AccountPageHeader
        title={t("wishlist.empty.title")}
        subtitle={t("wishlist.empty.description")}
        headingRef={headingRef}
      />
      <LocaleLink href="/" className={PRIMARY_LINK_CLASS}>
        {t("wishlist.empty.continueShopping")}
      </LocaleLink>
    </div>
  );
}

function WishlistProducts() {
  const t = useTranslations();
  const { refreshSession } = useSessionActions();
  const read = useCallback<PagedListRead<Schemas["Product"]>>(
    async (client, params) => {
      try {
        return await readWishlistPage(client, params);
      } catch (error) {
        if (hasApiErrorCode(error, CUSTOMER_NOT_LOGGED_IN)) {
          void refreshSession();
        }
        throw error;
      }
    },
    [refreshSession],
  );
  const list = usePagedList(read, DEFAULT_PAGE_SIZE, FAILURE_MESSAGE);
  const pageSizeId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeadingAfterRead = useRef(false);
  const { status, data, limit, totalPages } = list;
  const loading = status === "loading";

  useEffect(() => {
    if (status !== "ready" || !focusHeadingAfterRead.current) return;
    focusHeadingAfterRead.current = false;
    headingRef.current?.focus();
  }, [status, data]);

  if (status === "error") {
    return (
      <>
        <WishlistHeader />
        <div className="py-8 text-center text-sm" role="alert">
          <p className="text-surface-on-surface-variant">
            {t("listing.error")}
          </p>
          <button
            type="button"
            className="mt-3 text-surface-on-surface underline"
            onClick={() => {
              void list.retry();
            }}
          >
            {t("listing.retry")}
          </button>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <WishlistHeader />
        <SkeletonGrid count={limit} />
      </>
    );
  }

  if (data.total === 0) return <EmptyWishlist headingRef={headingRef} />;

  return (
    <>
      <WishlistHeader headingRef={headingRef} />
      <div
        ref={listRef}
        className={cx(
          "transition-opacity",
          loading && "pointer-events-none opacity-60",
        )}
        aria-busy={loading}
      >
        <ul className={GRID_CLASS}>
          {data.elements.map((product) => (
            <WishlistProductTile
              key={product.id}
              product={product}
              onRemoved={() => {
                focusHeadingAfterRead.current = true;
                void list.retry();
              }}
            />
          ))}
        </ul>
      </div>
      <div className="mt-8 mb-12 flex flex-col items-center gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-2">
        <Pagination
          className="sm:col-start-2"
          total={totalPages}
          current={Math.min(list.page, totalPages)}
          onChangePage={(page) => {
            scrollToList(listRef.current);
            void list.changePage(page);
          }}
        />
        <PageSizeSelector
          id={pageSizeId}
          className="sm:col-start-3 sm:justify-self-end"
          value={limit}
          options={PAGE_SIZE_OPTIONS}
          onChange={(size) => {
            void list.changeLimit(size);
          }}
        />
      </div>
    </>
  );
}

export function WishlistPageContent() {
  const session = useSession();
  const customerId = session.context?.customer?.id;

  function renderBody() {
    if (session.status === "loading") {
      return (
        <>
          <WishlistHeader />
          <SkeletonGrid count={DEFAULT_PAGE_SIZE} />
        </>
      );
    }
    if (!session.isLoggedIn) return <NotLoggedIn />;
    return <WishlistProducts key={customerId} />;
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-10 md:py-16">
      {renderBody()}
    </div>
  );
}
