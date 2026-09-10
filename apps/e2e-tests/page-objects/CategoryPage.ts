import { ListingPage } from "./ListingPage";

export class CategoryPage extends ListingPage {
  async selectRandomColorCheckbox() {
    await this.selectRandomPropertyCheckbox();
  }
}
