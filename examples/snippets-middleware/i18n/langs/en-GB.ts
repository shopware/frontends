export default defineI18nLocale(async (locale) => {
  return $fetch(`/api/translations?locale=${locale}`);
});
