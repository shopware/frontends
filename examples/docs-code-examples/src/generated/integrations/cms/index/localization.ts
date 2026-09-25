import { useI18n } from "#imports";

import type { CmsPage } from "./recommended-architecture";

const path = "home";
const resolvePage = async (
  _path: string,
  _locale: string,
): Promise<CmsPage | null> => null;

const { locale } = useI18n();
const page = await resolvePage(path, locale.value);
