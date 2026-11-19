import type { CmsComponentProps } from "../../registry";
import type { CmsElementForm as CmsElementFormContent } from "../../types";
import { CmsElementForm } from "./CmsElementForm";

export type CmsElementCustomFormProps =
  CmsComponentProps<CmsElementFormContent>;

export function CmsElementCustomForm(props: CmsElementCustomFormProps) {
  return <CmsElementForm {...props} />;
}
