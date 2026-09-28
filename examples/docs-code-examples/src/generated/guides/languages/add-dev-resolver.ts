import { ref, useInternationalization } from "#imports";

const { changeLanguage, getLanguageCodeFromId, replaceToDevStorefront } =
  useInternationalization();
const locale = ref("");
const dev = process.dev;

const onChangeHandler = async (option: Event) => {
  const data = await changeLanguage((option.target as HTMLSelectElement).value);

  // Check dev mode
  if (dev) {
    // Set locale
    locale.value = getLanguageCodeFromId(
      (option.target as HTMLSelectElement).value,
    );
    // Refresh page
    window.location.replace(`${window.location.origin}/${locale.value}`);
    return;
  }

  if (data.redirectUrl) {
    window.location.replace(replaceToDevStorefront(data.redirectUrl));
  } else {
    window.location.reload();
  }
};
