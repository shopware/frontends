test("navigation menu should not have automatically detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("https://your-site.com/");

  await page.getByRole("button", { name: "Navigation Menu" }).click();

  // It is important to waitFor() the page to be in the desired
  // state *before* running analyze(). Otherwise, axe might not
  // find all the elements your test expects it to scan.
  await page.locator("#navigation-menu-flyout").waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include("#navigation-menu-flyout")
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
