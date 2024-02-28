## Examples

**Simple projects explaining how to work with Composable Frontends.**

Here you can find a sample projects that you can run locally or using your favorite environment, like StackBlitz or CodeSandbox.

## Run an example in StackBlitz

In order to open and run an example use a StackBlitz pattern:

![https://developer.stackblitz.com/assets/Opening_a_Github_Project.2c05239c.png](https://developer.stackblitz.com/assets/Opening_a_Github_Project.2c05239c.png)

For example, to run `login-form` example you would need to open in your browser:

[https://stackblitz.com/github/shopware/frontends/tree/main/examples/login-form](https://stackblitz.com/github/shopware/frontends/tree/main/examples/login-form)

In an example URL above there are few parts that need explanation:

`github/shopware` - [github repository](https://github.com/shopware/frontends)

`tree/main` - a branch, starts with `tree/` and then the name of the branch

`examples/login-form` - directory in the GH repository where the example is placed

### Adding a new example

To keep every example consistent in terms of using it by the users there are few rules to follow:

- Use Vue or Nuxt as a base library/framework
- Try to always add a README.md explaining how to work with an example
- Add comments to the code wherever it's reasonable
- Keep It simple - the smaller example, the better
- Always test you example using StackBlitz before publishing
- Examples don't require a changeset

For E2E purposes:

- Wrap the presentation layer (an entrypoint template) in a DOM element with a `test-wrapper` test-id attribute, like in this [PR](https://github.com/shopware/frontends/pull/679/files#diff-12260e5806d489206db5e938f4e1027c4ac4362d4f7f6e3a8957cf3017e9a88cR158)
- Update [IGNORE_CHECK_EXAMPLES](https://github.com/shopware/frontends/blob/main/apps/e2e-tests/tests/checkCodeExamples.spec.ts#L7) with the name of your directory if an example cannot be run as a project (not a nuxt/vite project, or temporary buggy)
