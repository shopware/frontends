import { expect, MOCKED_STORE_API, test } from "../fixtures";
import { LoginForm } from "../page-objects/LoginPage";
import { PasswordRecoveryPage } from "../page-objects/PasswordRecoveryPage";

const CHECK_ROUTE = "**/store-api/account/customer-recovery-is-expired";
const CONFIRM_ROUTE = "**/store-api/account/recovery-password-confirm";
const HASH = "0123456789abcdef0123456789abcdef";
const NEW_PASSWORD = "new-password-123";

// The real body. Shopware sends the ArrayStruct flat, not under data[0].
const linkCheck = (isExpired: boolean) => ({
  json: { isExpired, apiAlias: "array_struct" },
});

test.describe("Password recovery", { tag: "@frontends" }, () => {
  let recoveryPage: PasswordRecoveryPage;

  test.beforeEach(async ({ page }) => {
    recoveryPage = new PasswordRecoveryPage(page);
  });

  test("Login page links to the recovery page", async ({ page }) => {
    await page.goto("/account/login");
    await new LoginForm(page).forgotPasswordLink.click();

    await expect(page).toHaveURL(/\/account\/recover$/);
    await expect(recoveryPage.recoverForm).toBeVisible();
  });

  test("Recovery request acknowledges an unknown address", async () => {
    await recoveryPage.visitRecoverPage();
    await recoveryPage.requestRecoveryMail(
      `nobody-${Date.now()}@example.invalid`,
    );

    await expect(recoveryPage.recoverSuccessMessage).toBeVisible();
    await expect(recoveryPage.recoverForm).toHaveCount(0);
  });

  // Shopware answers a known and an unknown address alike, so only an
  // operational failure may keep the form. The API is mocked because a real
  // outage cannot be provoked on demand.
  for (const [name, respond] of [
    ["unreachable", (route) => route.abort("connectionfailed")],
    [
      "rate limited",
      (route) =>
        route.fulfill({
          status: 429,
          json: {
            errors: [{ status: "429", code: "FRAMEWORK__RATE_LIMIT_EXCEEDED" }],
          },
        }),
    ],
  ] as const) {
    test(
      `Recovery request keeps the form when the API is ${name}`,
      { annotation: MOCKED_STORE_API },
      async ({ page }) => {
        await page.route("**/store-api/account/recovery-password", respond);
        await recoveryPage.visitRecoverPage();
        await recoveryPage.requestRecoveryMail("nobody@example.invalid");

        await expect(recoveryPage.errorNotification).toBeVisible();
        await expect(recoveryPage.recoverForm).toBeVisible();
        await expect(recoveryPage.recoverSuccessMessage).toHaveCount(0);
      },
    );
  }

  test("Reset page sends the link hash and rejects an invalid one", async ({
    page,
  }) => {
    const check = page.waitForRequest(
      (request) =>
        request.method() === "POST" &&
        request
          .url()
          .includes("/store-api/account/customer-recovery-is-expired"),
    );
    await recoveryPage.visitResetPage("not-a-valid-hash");

    const request = await check;
    expect(request.postDataJSON()).toEqual({ hash: "not-a-valid-hash" });
    expect((await request.response())?.status()).toBe(400);
    await expect(recoveryPage.resetExpiredMessage).toBeVisible();
    await expect(recoveryPage.resetForm).toHaveCount(0);
  });

  test.describe("Reset page", { annotation: MOCKED_STORE_API }, () => {
    test("offers a retry when the check gets no answer", async ({ page }) => {
      await page.route(CHECK_ROUTE, (route) => route.abort("connectionfailed"));
      await recoveryPage.visitResetPage(HASH);

      await expect(recoveryPage.resetRetryButton).toBeVisible();
      await expect(recoveryPage.resetForm).toHaveCount(0);

      await page.unroute(CHECK_ROUTE);
      await page.route(CHECK_ROUTE, (route) => route.fulfill(linkCheck(false)));
      await recoveryPage.resetRetryButton.click();

      await expect(recoveryPage.resetForm).toBeVisible();
      await expect(recoveryPage.resetNewPasswordInput).toBeFocused();
    });

    test("shows the expiry message for an expired link", async ({ page }) => {
      await page.route(CHECK_ROUTE, (route) => route.fulfill(linkCheck(true)));
      await recoveryPage.visitResetPage(HASH);

      await expect(recoveryPage.resetExpiredMessage).toBeVisible();
      await expect(recoveryPage.resetForm).toHaveCount(0);
    });

    test("sets a new password with a valid link", async ({ page }) => {
      await page.route(CHECK_ROUTE, (route) => route.fulfill(linkCheck(false)));
      await page.route(CONFIRM_ROUTE, (route) =>
        route.fulfill({ json: { success: true, apiAlias: "array_struct" } }),
      );
      await recoveryPage.visitResetPage(HASH);
      await expect(recoveryPage.resetForm).toBeVisible();

      const confirm = page.waitForRequest(CONFIRM_ROUTE);
      await recoveryPage.resetPassword(NEW_PASSWORD);

      expect((await confirm).postDataJSON()).toEqual({
        hash: HASH,
        newPassword: NEW_PASSWORD,
        newPasswordConfirm: NEW_PASSWORD,
      });
      await expect(recoveryPage.resetSuccessMessage).toBeVisible();
      await expect(recoveryPage.resetForm).toHaveCount(0);
    });

    test("shows the expiry message when the link expires before submit", async ({
      page,
    }) => {
      await page.route(CHECK_ROUTE, (route) => route.fulfill(linkCheck(false)));
      await page.route(CONFIRM_ROUTE, (route) =>
        route.fulfill({
          status: 410,
          json: {
            errors: [
              {
                status: "410",
                code: "CHECKOUT__CUSTOMER_RECOVERY_HASH_EXPIRED",
                detail: `The hash "${HASH}" is expired.`,
              },
            ],
          },
        }),
      );
      await recoveryPage.visitResetPage(HASH);
      await expect(recoveryPage.resetForm).toBeVisible();
      await recoveryPage.resetPassword(NEW_PASSWORD);

      await expect(recoveryPage.resetExpiredMessage).toBeFocused();
      await expect(page.getByText(HASH)).toHaveCount(0);
    });
  });
});
