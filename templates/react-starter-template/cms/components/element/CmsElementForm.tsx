import type { CmsContactFormEntityName } from "../../actions/CmsActionsContext";
import type { CmsRouteName } from "../../context";
import { cx } from "../../helpers/cx";
import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsElementForm as CmsElementFormContent } from "../../types";
import { toFormSalutations } from "../shared/formSalutations";
import { SwContactForm } from "../shared/SwContactForm";
import { SwNewsletterForm } from "../shared/SwNewsletterForm";

const CONTACT_FORM_ENTITY: Partial<
  Record<CmsRouteName, CmsContactFormEntityName>
> = {
  "frontend.navigation.page": "category",
  "frontend.detail.page": "product",
  "frontend.landing.page": "landing_page",
};

export type CmsElementFormProps = CmsComponentProps<CmsElementFormContent>;

export function CmsElementForm({
  content,
  ctx,
  className,
  style,
}: CmsElementFormProps) {
  const type = getConfigValue(content, "type");
  const title = getConfigValue(content, "title");
  const salutations = toFormSalutations(content.data);

  return (
    <div className={cx("cms-element-form", className)} style={style}>
      {type === "newsletter" ? (
        <SwNewsletterForm
          title={title}
          salutations={salutations}
          translations={ctx.translations}
        />
      ) : (
        <SwContactForm
          title={title}
          confirmationText={getConfigValue(content, "confirmationText")}
          salutations={salutations}
          navigationId={ctx.foreignKey}
          entityName={
            ctx.routeName ? CONTACT_FORM_ENTITY[ctx.routeName] : undefined
          }
          slotId={content.id}
          translations={ctx.translations}
        />
      )}
    </div>
  );
}
