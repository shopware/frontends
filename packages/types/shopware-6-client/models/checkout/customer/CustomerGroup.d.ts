import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type CustomerGroup = {
  id: string;
  name: string;
  displayGross: boolean;
  customFields: CustomFields;
  createdAt: string;
  updatedAt: null | string;
  displayGross: boolean;
  registrationActive: boolean;
  registrationTitle: string;
  registrationIntroduction: string;
  registrationOnlyCompanyRegistration: boolean;
  registrationSeoMetaDescription: null | string;
  translated: {
    [key in keyof Omit<
      CustomerGroup,
      "translated"
    > as CustomerGroup[key] extends string ? key : never]: string;
  };
};
