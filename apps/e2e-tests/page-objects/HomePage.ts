import { expect, type Locator, type Page } from "@playwright/test";

import { AbstractPage } from "./AbstractPage";
import { LoginForm } from "./LoginPage";

export class HomePage extends AbstractPage {
  //readonly page: Page
  readonly signInButton: Locator;
  readonly linkToRegistrationPage: Locator;
  readonly searchBar: Locator;
  readonly wishlistButton: Locator;
  readonly accountMenuHelloButton: Locator;
  readonly myAccountLink: Locator;
  readonly suggestResultLink: Locator;

  constructor(page: Page) {
    super(page);
    this.signInButton = page.getByTestId("header-sign-in-link");
    this.searchBar = page.getByTestId("layout-search-input");
    this.linkToRegistrationPage = page.getByTestId("login-sign-up-link");
    this.accountMenuHelloButton = page.getByTestId("account-menu-hello-button");
    this.myAccountLink = page.getByTestId("header-my-account-link");
    this.suggestResultLink = page.getByTestId(
      "layout-search-result-box-more-link",
    );
  }

  async visitMainPage() {
    await this.page.goto("/");
  }

  async clickOnSignIn() {
    await this.signInButton.waitFor();
    await this.signInButton.click({ delay: 500 });
  }

  /** The wishlist is server side, so a logged out toggle opens a login modal. */
  async loginAs(email: string, password: string) {
    if (!this.page.url().startsWith("http")) await this.visitMainPage();
    await this.clickOnSignIn();
    await new LoginForm(this.page).login(email, password);
    await this.accountMenuHelloButton.waitFor({ state: "visible" });
  }

  async openCartPage() {
    await this.openFirstCategoryPage();
    await this.openFirstProductPage();
  }

  /** Which products have variants is sales channel content, so walk until one does. */
  async openVariantsCartPage() {
    await this.openFirstCategoryPage();

    const productLinks = this.page.getByTestId("product-box-product-name-link");
    await productLinks.first().waitFor({ state: "visible" });
    const hrefs = (await productLinks.evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")),
    )) as (string | null)[];

    const tried: string[] = [];
    for (const href of hrefs.filter((entry): entry is string => !!entry)) {
      tried.push(href);
      await this.page.goto(href);
      await this.page.waitForSelector("[data-testid='product-quantity']", {
        state: "visible",
      });
      const hasVariants = await this.page
        .getByTestId("product-variant")
        .first()
        .isVisible()
        .catch(() => false);
      if (hasVariants) return;
    }

    throw new Error(
      `No product on the first category listing has variants. Tried: ${tried.join(", ")}.`,
    );
  }

  async openCategoryPage() {
    await this.openFirstCategoryPage();
  }

  /**
   * Template agnostic navigation. The first nav entry is not guaranteed to list
   * products, so entries are tried in order, by href rather than by click: a
   * click swaps the URL long before the listing renders.
   */
  async openFirstCategoryPage() {
    const sameTabEntries = this.page.locator(
      '[role="menubar"] [role="menuitem"]:not([target="_blank"])',
    );
    await sameTabEntries.first().waitFor({ state: "visible" });

    // Plain data, not Locators: those would point at the previous document
    // after the goto below, and the next read would block until the timeout.
    const candidates = (
      await sameTabEntries.evaluateAll((entries) =>
        entries.map((entry) => ({
          label: entry.textContent?.trim() || "(unnamed)",
          href: entry.getAttribute("href"),
        })),
      )
    ).slice(0, 3);

    const tried: string[] = [];
    for (const { label, href } of candidates) {
      if (!href) {
        tried.push(`${label} (no href)`);
        continue;
      }
      tried.push(label);
      await this.page.goto(href);
      try {
        await this.page
          .getByTestId("product-box-product-name-link")
          .first()
          .waitFor({ state: "visible", timeout: 5000 });
        await this.waitForHydration();
        return;
      } catch {
        continue;
      }
    }

    throw new Error(
      `No top navigation entry opened a product listing. Tried: ${tried.join(", ")}.`,
    );
  }

  async openFirstProductPage() {
    // By href, not by click: a click swaps the URL long before the detail page
    // renders, and the card can be replaced under it if the listing re-renders.
    const link = this.page.getByTestId("product-box-product-name-link").first();
    await link.waitFor({ state: "visible" });
    const href = await link.getAttribute("href");
    if (!href) {
      throw new Error("The first product card carries no link.");
    }

    await this.page.goto(href);
    await this.page.waitForSelector("[data-testid='product-quantity']", {
      state: "visible",
    });
  }

  /** Some templates link to a register page, the starter renders it inline. */
  async openRegistrationPage() {
    const form = this.page.getByTestId("registration-form");
    const signUpLink = this.linkToRegistrationPage;

    // The login step renders first, so a single isVisible() probe on the link
    // races it: a false reading skips the click and then waits out the timeout
    // on a form that was never opened.
    await expect(async () => {
      if (await form.isVisible()) return;
      await signUpLink.click({ timeout: 5000 });
      await form.waitFor({ state: "visible", timeout: 5000 });
    }).toPass({ intervals: [500, 1000, 2000], timeout: 45000 });
  }

  /** Taken from the catalogue: a hardcoded phrase ties the suite to one channel. */
  async firstProductSearchTerm() {
    const link = this.page.getByTestId("product-box-product-name-link").first();
    await link.waitFor({ state: "attached" });
    const name = (await link.textContent()) ?? "";
    return name.trim().split(/\s+/)[0] as string;
  }

  async typeSearchPhrase(phrase: string) {
    await this.page.waitForLoadState("networkidle");
    await this.searchBar.click();
    await this.searchBar.type(phrase);
    await this.page.waitForLoadState();
    await this.page.waitForSelector("[data-testid='layout-search-result-box']");
    await this.page.keyboard.press("Enter");
  }

  async searchBySuggest(phrase: string) {
    await this.page.waitForLoadState("networkidle");
    await this.searchBar.click();
    await this.searchBar.type(phrase);
    await this.page.waitForLoadState();
    await this.page.waitForSelector("[data-testid='layout-search-result-box']");
    await this.suggestResultLink.click();
  }

  /** The toggle is <client-only>, so its presence means the listing is hydrated. */
  async waitForHydration() {
    await this.page
      .getByTestId("product-box-toggle-wishlist-button")
      .first()
      .waitFor({ state: "visible" });
  }

  /** From a listing, not the landing page, where cards sit in sliders. */
  async addProductToWishlist() {
    await this.openFirstCategoryPage();

    // A toggle: clicking a product already wishlisted would remove it.
    const toggles = this.page.getByTestId("product-box-toggle-wishlist-button");
    const labels = await toggles.evaluateAll((controls) =>
      controls.map((control) => control.getAttribute("aria-label")),
    );
    const index = labels.indexOf("Add to wishlist");
    if (index === -1) {
      throw new Error("Every product on this listing is already wishlisted.");
    }

    // The control only flips once the entry is stored.
    const stored = this.page.waitForResponse(
      (response) =>
        response.url().includes("/customer/wishlist/add") && response.ok(),
      { timeout: 30000 },
    );
    await toggles.nth(index).click();
    await stored;

    await expect(toggles.nth(index)).toHaveAttribute(
      "aria-label",
      "Remove from wishlist",
    );
  }

  async openMyAccount() {
    await this.accountMenuHelloButton.waitFor();
    await this.accountMenuHelloButton.dispatchEvent("click");
    await this.myAccountLink.waitFor();
    await this.myAccountLink.dispatchEvent("click");
    await this.page.waitForURL("**/account");
  }
}
