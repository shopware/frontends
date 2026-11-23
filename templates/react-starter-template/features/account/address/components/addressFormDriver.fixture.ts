import { expect } from "vitest";

import { interact, query, queryAll, setInputValue } from "@/test/mount";

export function field<T extends Element>(root: ParentNode, id: string): T {
  return query<T>(root, `#${id}`);
}

export function errorText(root: ParentNode, id: string): string | null {
  return root.querySelector(`#${id}-error`)?.textContent ?? null;
}

export function setSelectValue(select: HTMLSelectElement, value: string) {
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

export async function chooseCountry(root: HTMLElement, name: string) {
  const combobox = query<HTMLInputElement>(
    root,
    '[data-testid="country-select"]',
  );
  await interact(() => combobox.click());
  await interact(() => setInputValue(combobox, name));
  const option = queryAll<HTMLButtonElement>(root, '[role="option"]').find(
    (candidate) => candidate.textContent?.includes(name),
  );
  expect(option).toBeDefined();
  await interact(() => option?.click());
}

export async function typeInto(root: ParentNode, id: string, value: string) {
  const input = field<HTMLInputElement>(root, id);
  await interact(() => setInputValue(input, value));
}

export async function fillAddress(
  root: HTMLElement,
  {
    salutationId = "salutation-mrs",
    firstName = "Erika",
    lastName = "Musterfrau",
    street = "Lindenallee 4",
    zipcode = "50667",
    city = "Cologne",
  }: Partial<
    Record<
      "salutationId" | "firstName" | "lastName" | "street" | "zipcode" | "city",
      string
    >
  > = {},
) {
  await interact(() =>
    setSelectValue(field<HTMLSelectElement>(root, "salutation"), salutationId),
  );
  await typeInto(root, "first-name", firstName);
  await typeInto(root, "last-name", lastName);
  await typeInto(root, "street", street);
  await typeInto(root, "zipcode", zipcode);
  await typeInto(root, "city", city);
}

export function submitButton(root: ParentNode): HTMLButtonElement {
  return query<HTMLButtonElement>(root, 'button[type="submit"]');
}
