import type { Locator, Page } from "@playwright/test";

export class MyAccountPage {
  readonly page: Page;
  readonly personalFirstName: Locator;
  readonly personalLastName: Locator;
  readonly accountPersonalDataSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.personalFirstName = page.getByTestId(
      "account-personal-data-firstname-input",
    );
    this.personalLastName = page.getByTestId(
      "account-personal-data-lastname-input",
    );
    this.accountPersonalDataSubmitButton = page.getByTestId(
      "account-personal-data-submit-button",
    );
  }

  async changePersonalData() {
    await this.page.goto("/account/profile");
    await this.personalFirstName.waitFor({ state: "visible" });
  }

  async changePersonalFirstName(firstname: string) {
    await this.page.waitForURL("**/account/profile");
    await this.personalFirstName.clear({ force: true });
    await this.personalFirstName.fill(firstname);
    await this.accountPersonalDataSubmitButton.click();
  }

  async changePersonalLastName(lastname: string) {
    await this.personalLastName.clear({ force: true });
    await this.personalLastName.fill(lastname);
    await this.accountPersonalDataSubmitButton.click();
  }
}
