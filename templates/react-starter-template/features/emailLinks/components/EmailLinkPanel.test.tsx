import { describe, expect, it } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import {
  EmailLinkHomeLink,
  EmailLinkLoginLink,
  EmailLinkPanel,
  EmailLinkRetryButton,
} from "./EmailLinkPanel";
import type { EmailLinkTone } from "./EmailLinkPanel";

function statusRegion(html: string): string {
  const match = /<output[^>]*>[\s\S]*?<\/output>/.exec(html);
  if (!match) throw new Error("No status region");
  return match[0];
}

describe("EmailLinkPanel", () => {
  it("renders the heading and the pending live region in the server HTML", async () => {
    const html = await renderToHtml(
      <EmailLinkPanel
        testId="registration-confirm-page"
        title="Account confirmation"
        tone="pending"
        message="Verifying your account..."
      />,
    );

    expect(html).toContain('data-testid="registration-confirm-page"');
    expect(html).toMatch(/<h1[^>]*>Account confirmation<\/h1>/);
    const region = statusRegion(html);
    expect(region).toContain('aria-live="polite"');
    expect(region).toContain('aria-busy="true"');
    expect(region).toContain('data-testid="email-link-status"');
    expect(region).toContain('data-state="pending"');
    expect(region).toContain("animate-spin");
    expect(region).toContain("Verifying your account...");
    expect(region).not.toMatch(/<(p|div)\b/);
  });

  it.each<[Exclude<EmailLinkTone, "pending">, string]>([
    ["success", "bg-states-success-container"],
    ["info", "bg-states-info-container"],
    ["error", "bg-states-error-container"],
  ])("gives the %s tone its token classes", async (tone, token) => {
    const html = await renderToHtml(
      <EmailLinkPanel
        testId="newsletter-confirm-page"
        title="Newsletter subscription"
        tone={tone}
        message="Message"
        detail="Detail"
      />,
    );

    const region = statusRegion(html);
    expect(region).toContain(`data-state="${tone}"`);
    expect(region).toContain(token);
    expect(region).not.toContain("aria-busy");
    expect(region).not.toContain("animate-spin");
    expect(region).toMatch(/<span[^>]*>Message<\/span>/);
    expect(region).toMatch(/<span[^>]*>Detail<\/span>/);
  });

  it("renders the actions outside the live region", async () => {
    const html = await renderToHtml(
      <EmailLinkPanel
        testId="registration-confirm-page"
        title="Account confirmation"
        tone="error"
        message="Message"
      >
        <EmailLinkRetryButton retrying={false} onRetry={() => {}} />
        <EmailLinkLoginLink variant="secondary" />
        <EmailLinkHomeLink variant="secondary" />
      </EmailLinkPanel>,
    );

    const region = statusRegion(html);
    expect(region).not.toMatch(/<(a|button)\b/);
    expect(html).toMatch(
      /<button type="button" data-testid="email-link-retry-button"[^>]*>Try again<\/button>/,
    );
    expect(html).toMatch(
      /<a [^>]*href="\/account\/login"[^>]*>Go to login<\/a>/,
    );
    expect(html).toContain('data-testid="email-link-login-link"');
    expect(html).toMatch(/<a [^>]*href="\/"[^>]*>Back to homepage<\/a>/);
  });

  it("renders no action row without actions", async () => {
    const html = await renderToHtml(
      <EmailLinkPanel
        testId="registration-confirm-page"
        title="Account confirmation"
        tone="pending"
        message="Verifying your account..."
      />,
    );

    expect(html).not.toContain("email-link-home-link");
    expect(html).not.toContain("flex-wrap");
  });

  it("marks a running retry busy without disabling it", async () => {
    const html = await renderToHtml(
      <EmailLinkRetryButton retrying onRetry={() => {}} />,
    );

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).not.toMatch(/\sdisabled=""/);
  });

  it("links to the pages of the locale", async () => {
    const html = await renderToHtml(
      withI18n(
        <>
          <EmailLinkLoginLink />
          <EmailLinkHomeLink />
        </>,
        "de-DE",
      ),
    );

    expect(html).toMatch(/href="\/de-DE\/account\/login"[^>]*>Zur Anmeldung</);
    expect(html).toMatch(/href="\/de-DE"[^>]*>Zurück zur Startseite</);
  });
});
