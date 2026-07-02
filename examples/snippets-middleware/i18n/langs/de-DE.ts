export default async (locale: string) => {
  return $fetch(`/api/translations?locale=${locale}`);
};
