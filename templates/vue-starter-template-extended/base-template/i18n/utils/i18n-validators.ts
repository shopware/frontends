import {
  url,
  alpha,
  alphaNum,
  between,
  decimal,
  email,
  integer,
  ipv4Address,
  macAddress,
  maxLength,
  minLength,
  minValue,
  not,
  numeric,
  or,
  required,
  requiredIf,
  requiredUnless,
  sameAs,
  withMessage,
} from "@regle/rules";

export const customValidators = () => {
  const { $i18n } = useNuxtApp();
  const t = $i18n.t.bind($i18n);

  const getMessage = (key: string, params?: Record<string, unknown>) => {
    return () => t(`validations.${key}`, params || {});
  };

  return {
    alpha: withMessage(alpha, getMessage("alpha")),
    alphaNum: withMessage(alphaNum, getMessage("alphaNum")),
    between: (min: number, max: number) =>
      withMessage(between(min, max), getMessage("between", { min, max })),
    decimal: withMessage(decimal, getMessage("decimal")),
    email: withMessage(email, getMessage("email")),
    integer: withMessage(integer, getMessage("integer")),
    ipAddress: withMessage(ipv4Address, getMessage("ipAddress")),
    macAddress: withMessage(macAddress, getMessage("macAddress")),
    maxLength: (max: number) =>
      withMessage(maxLength(max), getMessage("maxLength", { max })),
    minLength: (min: number) =>
      withMessage(minLength(min), getMessage("minLength", { min })),
    minValue: (min: number) =>
      withMessage(minValue(min), getMessage("minValue", { min })),
    not: (validator: Parameters<typeof not>[0]) =>
      withMessage(not(validator), getMessage("not")),
    numeric: withMessage(numeric, getMessage("numeric")),
    or: <T extends [Parameters<typeof or>[0], ...Parameters<typeof or>[0][]]>(
      ...validators: T
    ) =>
      withMessage(
        or(...(validators as Parameters<typeof or>)),
        getMessage("or"),
      ),
    required: withMessage(required, getMessage("required")),
    requiredIf: (condition: () => boolean) =>
      withMessage(requiredIf(condition), getMessage("requiredIf")),
    requiredUnless: (condition: () => boolean) =>
      withMessage(requiredUnless(condition), getMessage("requiredUnless")),
    sameAs: (other: unknown, otherName?: string) =>
      withMessage(
        sameAs(other, otherName),
        getMessage("sameAs", { otherName }),
      ),
    url: withMessage(url, getMessage("url")),
  };
};
