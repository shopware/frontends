import { cx } from "../../helpers/cx";
import type { CmsComponentProps } from "../../registry";
import type { CmsElementCategoryNavigation as CmsElementCategoryNavigationContent } from "../../types";
import { toCategoryNavigationItems } from "../shared/categoryNavigation";
import { SwCategoryNavigation } from "../shared/SwCategoryNavigation";

export function CmsElementCategoryNavigation({
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementCategoryNavigationContent>) {
  const navigation = ctx.navigation ?? [];
  if (navigation.length === 0) return null;

  const elements = toCategoryNavigationItems(navigation, ctx.urlPrefix);

  return (
    <div
      className={cx(
        "self-stretch inline-flex flex-col justify-start items-start gap-3",
        className,
      )}
      style={style}
    >
      <SwCategoryNavigation
        level={0}
        elements={elements}
        activeCategoryId={ctx.category?.id}
      />
    </div>
  );
}
