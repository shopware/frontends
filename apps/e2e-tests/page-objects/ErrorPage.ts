import type { Locator, Page } from "@playwright/test";

export class ErrorPage {
  readonly page: Page;
  readonly errorContainer: Locator;
  readonly homeButton: Locator;
  readonly maintenanceContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.errorContainer = page.getByTestId("error-page");
    this.homeButton = page.getByTestId("error-page-home-button");
    this.maintenanceContainer = page.getByTestId("maintenance-page");
  }
}
