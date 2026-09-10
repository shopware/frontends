import type { Locator, Page } from "@playwright/test";

/** A native select in some templates, a searchable combobox in others. */
export async function selectCountry(
  page: Page,
  country: Locator,
  name: string,
) {
  const isNativeSelect = await country.evaluate(
    (element) => element.tagName.toLowerCase() === "select",
  );

  if (isNativeSelect) {
    await country.selectOption({ label: name });
    return;
  }

  // The listbox only renders once the control is active.
  await country.click();
  await country.fill(name);
  await page.getByRole("option", { name }).first().click();
}

/** Which fields a form renders is template content. */
export async function selectFirstOptionIfPresent(field: Locator) {
  if ((await field.count()) === 0) return;
  const options = field.locator("option");
  if ((await options.count()) > 1) {
    await field.selectOption({ index: 1 });
  }
}
