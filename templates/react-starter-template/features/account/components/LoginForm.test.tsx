import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { LoginForm } from "./LoginForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

function tag(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

function elementWithTestId(html: string, testId: string): string {
  return tag(html, new RegExp(`<[a-z]+[^>]*data-testid="${testId}"[^>]*>`));
}

function requiredLabel(text: string): string {
  return `>${text}<span aria-hidden="true" class="ml-0.5 text-states-error">*</span></label>`;
}

const REQUIRED_ATTRIBUTE = /\srequired(=""|\s|>)/;
const DISABLED_ATTRIBUTE = /\sdisabled(=""|\s|>)/;

describe("LoginForm", () => {
  it("renders the heading and the Vue copy", async () => {
    const html = await renderToHtml(<LoginForm />);

    expect(html).toContain("<h1");
    expect(html).toContain(">Sign in to your account</h1>");
    expect(html).toContain(">Sign in to your account to continue</p>");
    expect(html).toContain(">Sign in</span>");
    expect(html).toContain(">Sign up</span>");
  });

  it("labels and wires the two inputs", async () => {
    const html = await renderToHtml(<LoginForm />);

    const form = tag(html, /<form [^>]*>/);
    expect(form).toContain('data-testid="login-form"');
    expect(form.toLowerCase()).toContain("novalidate");

    const email = elementWithTestId(html, "login-email-input");
    expect(email).toContain('id="login-username"');
    expect(email).toContain('type="email"');
    expect(email.toLowerCase()).toContain('autocomplete="username"');
    expect(email).toMatch(REQUIRED_ATTRIBUTE);
    expect(html).toContain('<label for="login-username"');
    expect(html).toContain(requiredLabel("Email address"));

    const password = elementWithTestId(html, "login-password-input");
    expect(password).toContain('id="login-password"');
    expect(password).toContain('type="password"');
    expect(password.toLowerCase()).toContain('autocomplete="current-password"');
    expect(password).toMatch(REQUIRED_ATTRIBUTE);
    expect(html).toContain('<label for="login-password"');
    expect(html).toContain(requiredLabel("Password"));
    expect(html).toContain(
      ">Fields marked with asterisks (*) are required.</p>",
    );
  });

  it("renders the submit and sign-up buttons", async () => {
    const html = await renderToHtml(<LoginForm />);

    const submit = elementWithTestId(html, "login-submit-button");
    expect(submit).toContain('type="submit"');
    expect(submit).toContain('aria-busy="false"');
    expect(submit).not.toMatch(DISABLED_ATTRIBUTE);
    expect(submit).not.toContain("aria-disabled=");

    const signUp = elementWithTestId(html, "login-sign-up-button");
    expect(signUp).toContain('type="button"');
    expect(signUp).toContain("bg-brand-secondary");
  });

  it("omits the sign-up button when hideSignUp is set", async () => {
    const html = await renderToHtml(<LoginForm hideSignUp />);

    expect(html).not.toContain("login-sign-up-button");
    expect(html).not.toContain(">Sign up</span>");
    expect(html).toContain('data-testid="login-submit-button"');
  });

  it("links to the password recovery between the password and the submit button", async () => {
    const html = await renderToHtml(<LoginForm />);

    const link = elementWithTestId(html, "login-forgot-password-link");
    expect(link).toMatch(/^<a /);
    expect(link).toContain('href="/account/recover"');
    expect(html).toContain(">Forgot your password?</a>");
    const password = html.indexOf('data-testid="login-password-input"');
    const forgot = html.indexOf('data-testid="login-forgot-password-link"');
    const submit = html.indexOf('data-testid="login-submit-button"');
    expect(password).toBeGreaterThan(-1);
    expect(forgot).toBeGreaterThan(password);
    expect(submit).toBeGreaterThan(forgot);
  });

  it("links to the prefixed recovery page in Polish", async () => {
    const html = await renderToHtml(withI18n(<LoginForm />, "pl-PL"));

    expect(elementWithTestId(html, "login-forgot-password-link")).toContain(
      'href="/pl-PL/account/recover"',
    );
    expect(html).toContain(">Nie pamiętasz hasła?</a>");
  });

  it("shows no errors before any interaction", async () => {
    const html = await renderToHtml(<LoginForm />);

    expect(html).not.toContain("Value is required");
    expect(html).not.toContain('aria-invalid="true"');
    expect(html).not.toMatch(/id="[\w-]+-error"/);
    expect(html).not.toContain("aria-describedby");
  });
});
