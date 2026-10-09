"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import type { CSSProperties } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import type { CmsVariantResult } from "../../actions/CmsActionsContext";
import { cx } from "../../helpers/cx";
import { prefixUrl } from "../../helpers/resolveUrl";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { SpinnerIcon } from "../icons";
import type { SwVariantOptionGroup } from "./variantOptionGroups";

export type SwVariantConfiguratorOptionsProps = {
  productId: string;
  parentId?: string;
  optionIds: string[];
  optionGroups: SwVariantOptionGroup[];
  urlPrefix: string;
  translations?: CmsTranslations;
  allowRedirect?: boolean;
  onChange?: (variant: CmsVariantResult | null) => void;
  className?: string;
  style?: CSSProperties;
};

type Selection = {
  productId: string;
  selected: Record<string, string>;
};

const translationDefaults = {
  product: {
    chooseA: "Choose a",
  },
};

function getInitialSelection(
  optionGroups: SwVariantOptionGroup[],
  optionIds: string[],
): Record<string, string> {
  const selected: Record<string, string> = {};
  for (const optionId of optionIds) {
    const group = optionGroups.find((optionGroup) =>
      optionGroup.options.some((option) => option.id === optionId),
    );
    if (group) {
      selected[group.id] = optionId;
    }
  }
  return selected;
}

export function SwVariantConfiguratorOptions({
  productId,
  parentId,
  optionIds,
  optionGroups,
  urlPrefix,
  translations: translationsInput,
  allowRedirect = true,
  onChange,
  className,
  style,
}: SwVariantConfiguratorOptionsProps) {
  const translations = withTranslationDefaults(
    translationsInput,
    translationDefaults,
  );
  const actions = useCmsActions();
  const router = useRouter();
  const radioGroupId = useId();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState<Selection>(() => ({
    productId,
    selected: getInitialSelection(optionGroups, optionIds),
  }));

  const selected =
    selection.productId === productId
      ? selection.selected
      : getInitialSelection(optionGroups, optionIds);
  const selectedOptionIds = Object.values(selected);

  async function handleChange(group: SwVariantOptionGroup, optionId: string) {
    const next = { ...selected, [group.id]: optionId };
    setSelection({ productId, selected: next });
    setIsLoading(true);
    try {
      const variant = await actions.findVariant({
        productId,
        parentId,
        options: Object.values(next),
        switchedGroup: group.id,
      });
      if (!allowRedirect || !variant) {
        onChange?.(variant);
        return;
      }
      const path = prefixUrl(
        variant.url ?? `/detail/${variant.productId}`,
        urlPrefix,
      );
      startTransition(() => {
        router.push(path);
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cx("relative flex flex-col", className)} style={style}>
      {isLoading || isPending ? (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/75">
          <SpinnerIcon
            data-testid="loading"
            className="h-15 w-15 animate-spin text-gray-500"
          />
        </div>
      ) : null}
      {optionGroups.map((optionGroup) => (
        <div key={optionGroup.id} className="mt-6">
          <div className="text-sm text-gray-900 font-medium">
            {optionGroup.name}
          </div>
          <fieldset className="mt-4 flex-1">
            <legend className="sr-only">
              {translations.product.chooseA} {optionGroup.name}
            </legend>
            <div className="flex gap-3">
              {optionGroup.options.map((option) => {
                const isSelected = selectedOptionIds.includes(option.id);
                return (
                  <label
                    key={option.id}
                    data-testid="product-variant"
                    className={cx(
                      "group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-hidden sm:flex-1 bg-white shadow-xs text-gray-900 cursor-pointer",
                      isSelected && "border-[3px] border-brand-primary",
                    )}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name={`${radioGroupId}${optionGroup.id}`}
                      value={option.id}
                      checked={isSelected}
                      onChange={() => {
                        void handleChange(optionGroup, option.id);
                      }}
                    />
                    <p
                      id={`${option.id}-choice-label`}
                      data-testid="product-variant-text"
                    >
                      {option.name}
                    </p>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      ))}
    </div>
  );
}
