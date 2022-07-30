import { CustomField } from "../../common/CustomField";

/**
 * @public
 */
export type DocumentTypeTranslation = {
  documentTypeId: string;
  documentType: DocumentType | null;
  name: string | null;
  customFields: CustomField[];
};
