import { useEffect, useState } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { interact, mount, query } from "@/test/mount";
import type { Mounted } from "@/test/mount";

import type { Locale } from "./config";
import { I18nProvider, useLocalePath, useTranslations } from "./I18nProvider";
import { getMessages } from "./messages";
import type { Translate } from "./translate";

let mounted: Mounted | undefined;

afterEach(async () => {
  await mounted?.unmount();
  mounted = undefined;
});

const seen: Translate[] = [];

function Probe() {
  const t = useTranslations();
  const localePath = useLocalePath();
  useEffect(() => {
    seen.push(t);
  }, [t]);
  return (
    <a href={localePath("/checkout")} data-testid="probe">
      {t("cart.title")}
    </a>
  );
}

function Switcher() {
  const [locale, setLocale] = useState<Locale>("en-GB");
  const [renders, setRenders] = useState(0);
  return (
    <I18nProvider locale={locale} messages={getMessages(locale)}>
      <Probe />
      <button
        type="button"
        data-testid="to-german"
        onClick={() => setLocale("de-DE")}
      >
        German
      </button>
      <button
        type="button"
        data-testid="rerender"
        onClick={() => setRenders(renders + 1)}
      >
        Render again
      </button>
    </I18nProvider>
  );
}

describe("I18nProvider in the browser", () => {
  it("keeps the translator while the locale stays and switches it with the locale", async () => {
    seen.length = 0;
    mounted = await mount(<Switcher />);
    const { container } = mounted;
    const probe = () =>
      query<HTMLAnchorElement>(container, '[data-testid="probe"]');

    expect(probe().textContent).toBe("My cart");
    expect(probe().getAttribute("href")).toBe("/checkout");

    await interact(() =>
      query<HTMLButtonElement>(container, '[data-testid="rerender"]').click(),
    );
    expect(seen).toHaveLength(1);

    await interact(() =>
      query<HTMLButtonElement>(container, '[data-testid="to-german"]').click(),
    );

    expect(probe().textContent).toBe("Mein Warenkorb");
    expect(probe().getAttribute("href")).toBe("/de-DE/checkout");
    expect(seen).toHaveLength(2);
  });
});
