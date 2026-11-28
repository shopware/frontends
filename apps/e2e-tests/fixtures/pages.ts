import { CartPage } from "../page-objects/CartPage";
import { CategoryPage } from "../page-objects/CategoryPage";
import { CheckoutPage } from "../page-objects/CheckoutPage";
import { ErrorPage } from "../page-objects/ErrorPage";
import { HomePage } from "../page-objects/HomePage";
import { LoginForm } from "../page-objects/LoginPage";
import { MyAccountPage } from "../page-objects/MyAccountPage";
import { ProductPage } from "../page-objects/ProductPage";
import { RegisterForm } from "../page-objects/RegisterPage";
import { SearchResultPage } from "../page-objects/SearchResultPage";
import { WishlistPage } from "../page-objects/WishlistPage";
import { test as base } from "./session";

export const test = base.extend<{
  homePage: HomePage;
  categoryPage: CategoryPage;
  searchResultPage: SearchResultPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  loginForm: LoginForm;
  registrationPage: RegisterForm;
  myAccountPage: MyAccountPage;
  wishlistPage: WishlistPage;
  errorPage: ErrorPage;
}>({
  // Next.js keeps up to three soft-navigated pages mounted but hidden, so a
  // test id would match their copies too. Only what the user sees counts.
  page: async ({ page }, use) => {
    const getByTestId = page.getByTestId.bind(page);
    page.getByTestId = (testId) =>
      getByTestId(testId).filter({ visible: true });
    await use(page);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
  searchResultPage: async ({ page }, use) => {
    await use(new SearchResultPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page, storeApi }, use) => {
    await use(new CheckoutPage(page, storeApi));
  },
  loginForm: async ({ page }, use) => {
    await use(new LoginForm(page));
  },
  registrationPage: async ({ page, storeApi }, use) => {
    await use(new RegisterForm(page, storeApi));
  },
  myAccountPage: async ({ page }, use) => {
    await use(new MyAccountPage(page));
  },
  wishlistPage: async ({ page }, use) => {
    await use(new WishlistPage(page));
  },
  errorPage: async ({ page }, use) => {
    await use(new ErrorPage(page));
  },
});
