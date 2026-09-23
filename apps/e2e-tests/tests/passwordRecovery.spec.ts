import { expect, test } from "../fixtures";
import { PasswordRecoveryPage } from "../page-objects/PasswordRecoveryPage";

test.describe("Password recovery", { tag: "@frontends" }, () => {
  let recoveryPage: PasswordRecoveryPage;

  test.beforeEach(async ({ page }) => {
    recoveryPage = new PasswordRecoveryPage(page);
  });

  test("Login page links to the recovery page", async ({ page }) => {
    await page.goto("/account/login");
    await recoveryPage.forgotPasswordLink.click();

    await expect(page).toHaveURL(/\/account\/recover$/);
    await expect(recoveryPage.recoverForm).toBeVisible();
  });

  test("Recovery request shows the same acknowledgement for any address", async () => {
    await recoveryPage.visitRecoverPage();
    await recoveryPage.requestRecoveryMail(
      `nobody-${Date.now()}@example.invalid`,
    );

    await expect(recoveryPage.successMessage).toBeVisible();
    await expect(recoveryPage.recoverForm).toHaveCount(0);
  });

  test("Reset page rejects an invalid link", async () => {
    await recoveryPage.visitResetPage("not-a-valid-hash");

    // A check that got no answer offers a retry, not a verdict. Take it once.
    await expect(async () => {
      if (await recoveryPage.retryButton.isVisible()) {
        await recoveryPage.retryButton.click();
      }
      await expect(recoveryPage.expiredMessage).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 30000 });
    await expect(recoveryPage.resetForm).toHaveCount(0);
  });
});
