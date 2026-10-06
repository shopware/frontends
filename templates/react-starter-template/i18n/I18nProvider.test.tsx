import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import {
  I18nProvider,
  useLocale,
  useLocalePath,
  useMessages,
  useTranslations,
} from "./I18nProvider";
import { getMessages } from "./messages";

function Probe() {
  const locale = useLocale();
  const t = useTranslations();
  const localePath = useLocalePath();
  const messages = useMessages();
  return (
    <p
      lang={locale}
      data-href={localePath("/account")}
      data-same-messages={String(messages === getMessages(locale))}
    >
      {t("loginForm.submitButtonLabel")} {t("search.result", undefined, 5)}
    </p>
  );
}

describe("I18nProvider on the server", () => {
  it("renders English without a provider", async () => {
    const html = await renderToHtml(<Probe />);

    expect(html).toBe(
      '<p lang="en-GB" data-href="/account" data-same-messages="true">Sign in<!-- --> <!-- -->results</p>',
    );
  });

  it.each([
    ["pl-PL", "/pl-PL/account", "Zaloguj się", "wyników"],
    ["de-DE", "/de-DE/account", "Anmelden", "Ergebnisse"],
    ["en-GB", "/account", "Sign in", "results"],
  ] as const)(
    "renders the %s messages, plurals and links",
    async (locale, href, label, plural) => {
      const html = await renderToHtml(
        <I18nProvider locale={locale} messages={getMessages(locale)}>
          <Probe />
        </I18nProvider>,
      );

      expect(html).toBe(
        `<p lang="${locale}" data-href="${href}" data-same-messages="true">${label}<!-- --> <!-- -->${plural}</p>`,
      );
    },
  );

  it("falls back to English for a key the given messages lack", async () => {
    function Label() {
      return <span>{useTranslations()("loginForm.passwordLabel")}</span>;
    }

    const html = await renderToHtml(
      <I18nProvider locale="pl-PL" messages={{}}>
        <Label />
      </I18nProvider>,
    );

    expect(html).toBe("<span>Password</span>");
  });
});
