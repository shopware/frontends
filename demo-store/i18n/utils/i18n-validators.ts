import * as validators from "@vuelidate/validators";

export const customValidators = () => {
  const { $i18n } = useNuxtApp();
  const { createI18nMessage } = validators;
  const withI18nMessage = createI18nMessage({ t: $i18n.t.bind($i18n) });

  return {
    alpha: withI18nMessage(validators.alpha),
    alphaNum: withI18nMessage(validators.alphaNum),
    between: withI18nMessage(validators.between, { withArguments: true }),
    decimal: withI18nMessage(validators.decimal),
    email: withI18nMessage(validators.email),
    integer: withI18nMessage(validators.integer),
    ipAddress: withI18nMessage(validators.ipAddress),
    macAddress: withI18nMessage(validators.macAddress),
    maxLength: withI18nMessage(validators.maxLength, { withArguments: true }),
    minLength: withI18nMessage(validators.minLength, { withArguments: true }),
    minValue: withI18nMessage(validators.minValue, { withArguments: true }),
    not: withI18nMessage(validators.not, { withArguments: true }),
    numeric: withI18nMessage(validators.numeric),
    or: withI18nMessage(validators.or, { withArguments: true }),
    required: withI18nMessage(validators.required),
    requiredIf: withI18nMessage(validators.requiredIf, { withArguments: true }),
    requiredUnless: withI18nMessage(validators.requiredUnless, {
      withArguments: true,
    }),
    sameAs: withI18nMessage(validators.sameAs, { withArguments: true }),
    url: withI18nMessage(validators.url),
  };
};
