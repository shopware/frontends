import { Plugin } from "./Plugin";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type PluginTranslation = {
  pluginId: string;
  label: string | null;
  description: string | null;
  manufacturerLink: string | null;
  supportLink: string | null;
  changelog: [] | null;
  plugin: Plugin | null;
  customFields: CustomFields;
};
