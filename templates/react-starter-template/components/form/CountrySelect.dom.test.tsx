import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CountryOption } from "@/platform/shopware/reads/countryOptions";
import {
  interact,
  mount,
  pressKey,
  query,
  queryAll,
  setInputValue,
} from "@/test/mount";
import type { Mounted } from "@/test/mount";

import { countries, france, germany, poland } from "./countries.fixture";
import { CountrySelect } from "./CountrySelect";

const INPUT = '[data-testid="country-select"]';
const LISTBOX = '[role="listbox"]';
const OPTION = '[role="option"]';

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

type OnChange = (countryId: string, country: CountryOption | null) => void;

type HarnessProps = {
  initialValue?: string;
  list?: CountryOption[];
  onBlur?: () => void;
  loadError?: boolean;
};

function Harness({
  onChange,
  initialValue = "",
  list = countries,
  onBlur,
  loadError,
}: HarnessProps & { onChange: OnChange }) {
  const [value, setValue] = useState(initialValue);
  return (
    <CountrySelect
      label="Country"
      placeholder="Choose country..."
      countries={list}
      value={value}
      onBlur={onBlur}
      loadError={loadError}
      onChange={(countryId, country) => {
        setValue(countryId);
        onChange(countryId, country);
      }}
    />
  );
}

async function setup(props: HarnessProps = {}) {
  const onChange = vi.fn<OnChange>();
  mounted = await mount(<Harness onChange={onChange} {...props} />);
  const { container } = mounted;
  return {
    container,
    onChange,
    input: query<HTMLInputElement>(container, INPUT),
    listbox: () => container.querySelector<HTMLElement>(LISTBOX),
    options: () => queryAll<HTMLButtonElement>(container, OPTION),
  };
}

describe("CountrySelect in the browser", () => {
  it("opens on focus and filters the options by the typed term", async () => {
    const { input, listbox, options } = await setup();

    await interact(() => input.focus());

    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(listbox()?.id).toBe("country-listbox");
    expect(input.getAttribute("aria-controls")).toBe("country-listbox");
    expect(options()).toHaveLength(4);

    await interact(() => setInputValue(input, "ger"));

    const [option] = options();
    expect(options()).toHaveLength(1);
    expect(option?.textContent).toBe("Germany");
    expect(option?.id).toBe("country-option-0");
    expect(option?.getAttribute("aria-selected")).toBe("true");
    expect(input.getAttribute("aria-activedescendant")).toBe(
      "country-option-0",
    );
    expect(input.value).toBe("ger");
  });

  it("selects the clicked option, closes the list and shows the country", async () => {
    const { container, input, onChange, listbox } = await setup();

    await interact(() => input.focus());
    await interact(() => setInputValue(input, "ger"));
    await interact(() => query<HTMLButtonElement>(container, OPTION).click());

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(germany.id, germany);
    expect(listbox()).toBeNull();
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(input.value).toBe("Germany");
    expect(query<HTMLImageElement>(container, "img").getAttribute("src")).toBe(
      "https://flagcdn.com/de.svg",
    );
    expect(
      container.querySelector('[data-testid="country-select-clear"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-testid="country-select-toggle"]'),
    ).toBeNull();
  });

  it("moves the highlight with the arrow keys and selects with Enter", async () => {
    const { input, onChange, listbox } = await setup();

    await interact(() => input.focus());
    expect(input.getAttribute("aria-activedescendant")).toBe(
      "country-option-0",
    );

    await interact(() => pressKey(input, "ArrowUp"));
    expect(input.getAttribute("aria-activedescendant")).toBe(
      "country-option-3",
    );

    await interact(() => pressKey(input, "ArrowDown"));
    expect(input.getAttribute("aria-activedescendant")).toBe(
      "country-option-0",
    );

    await interact(() => pressKey(input, "ArrowDown"));
    await interact(() => pressKey(input, "ArrowDown"));
    expect(input.getAttribute("aria-activedescendant")).toBe(
      "country-option-2",
    );

    await interact(() => pressKey(input, "Enter"));

    expect(onChange).toHaveBeenCalledWith(france.id, france);
    expect(listbox()).toBeNull();
    expect(input.value).toBe("France");
  });

  it("opens from Enter and highlights the current value", async () => {
    const { input, listbox, options } = await setup({
      initialValue: poland.id,
    });

    await interact(() => pressKey(input, "Enter"));

    expect(listbox()).not.toBeNull();
    expect(input.getAttribute("aria-activedescendant")).toBe(
      "country-option-1",
    );
    expect(options()[1]?.getAttribute("aria-selected")).toBe("true");
    expect(options()[1]?.querySelector("svg")).not.toBeNull();
  });

  it("closes on Escape without changing the value", async () => {
    const { input, onChange, listbox } = await setup({
      initialValue: poland.id,
    });

    await interact(() => input.focus());
    expect(listbox()).not.toBeNull();
    expect(input.value).toBe("");

    await interact(() => pressKey(input, "Escape"));

    expect(listbox()).toBeNull();
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(input.value).toBe("Poland");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("closes on a mousedown outside the component", async () => {
    const { input, listbox } = await setup();

    await interact(() => input.focus());
    expect(listbox()).not.toBeNull();

    await interact(() =>
      document.body.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      ),
    );

    expect(listbox()).toBeNull();
  });

  it("shows a message when nothing matches", async () => {
    const { input, listbox, options } = await setup();

    await interact(() => input.focus());
    await interact(() => setInputValue(input, "zzz"));

    expect(options()).toHaveLength(0);
    expect(listbox()?.textContent).toBe("No countries found");
    expect(input.getAttribute("aria-activedescendant")).toBeNull();
  });

  it("clears the selection from the clear button", async () => {
    const { container, input, onChange } = await setup({
      initialValue: poland.id,
    });
    expect(input.value).toBe("Poland");

    await interact(() =>
      query<HTMLButtonElement>(
        container,
        '[data-testid="country-select-clear"]',
      ).click(),
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("", null);
    expect(input.value).toBe("");
    expect(
      container.querySelector('[data-testid="country-select-clear"]'),
    ).toBeNull();
    expect(
      container.querySelector('[data-testid="country-select-toggle"]'),
    ).not.toBeNull();
  });

  it("toggles the list from the chevron button", async () => {
    const { container, input, listbox } = await setup();
    const toggle = query<HTMLButtonElement>(
      container,
      '[data-testid="country-select-toggle"]',
    );

    await interact(() => toggle.click());

    expect(listbox()).not.toBeNull();
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.getAttribute("aria-controls")).toBe("country-listbox");
    expect(document.activeElement).toBe(input);

    await interact(() => toggle.click());

    expect(listbox()).toBeNull();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes when focus leaves the component and forwards onBlur", async () => {
    const onBlur = vi.fn();
    const { input, listbox, options } = await setup({ onBlur });

    await interact(() => input.focus());
    await interact(() =>
      input.dispatchEvent(
        new FocusEvent("focusout", {
          bubbles: true,
          relatedTarget: options()[0],
        }),
      ),
    );
    expect(listbox()).not.toBeNull();

    await interact(() =>
      input.dispatchEvent(
        new FocusEvent("focusout", {
          bubbles: true,
          relatedTarget: document.body,
        }),
      ),
    );

    expect(listbox()).toBeNull();
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(onBlur).toHaveBeenCalledTimes(2);
  });

  it("clears the value when the selected option is clicked again", async () => {
    const { input, onChange, options } = await setup({
      initialValue: poland.id,
    });

    await interact(() => input.focus());
    await interact(() => options()[1]?.click());

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("", null);
    expect(input.value).toBe("");
  });

  it("outlines only the highlighted option", async () => {
    const { input, options } = await setup();

    await interact(() => input.focus());
    await interact(() => pressKey(input, "ArrowDown"));

    const [first, second] = options();
    expect(second?.getAttribute("aria-selected")).toBe("true");
    expect(second?.className).toContain("outline-outline-outline-focus");
    expect(second?.className).toContain("outline-2");
    expect(first?.className).not.toContain("outline-");
  });

  it("reports a failed country read instead of an empty search", async () => {
    const { container, input, listbox } = await setup({
      list: [],
      loadError: true,
    });

    await interact(() => input.focus());
    await interact(() => input.click());

    expect(listbox()).toBeNull();
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(container.textContent).not.toContain("No countries found");
    const message = query<HTMLParagraphElement>(container, "#country-error");
    expect(message.textContent).toBe("Countries could not be loaded");
    expect(message.getAttribute("role")).toBe("alert");
    expect(message.className).toContain("text-states-error");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("country-error");

    await interact(() => setInputValue(input, "ger"));
    expect(listbox()).toBeNull();
    expect(container.textContent).not.toContain("No countries found");
  });

  it("selects the only country on mount and disables the input", async () => {
    const { input, onChange, listbox } = await setup({ list: [germany] });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(germany.id, germany);
    expect(input.disabled).toBe(true);
    expect(input.value).toBe("Germany");
    expect(input.getAttribute("role")).toBeNull();
    expect(listbox()).toBeNull();
  });
});
