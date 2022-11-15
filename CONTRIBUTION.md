# Contribution

## Changelog preparation

In order to keep track of the changes inside project we do use `changesets` package to generate changelogs. After you created some changes follow these steps:

1. run `pnpm changeset`
2. pick packages inside which you made changes
3. pick packages for `major`, `minor` or `patch` version bump depending on your changes
4. write a short description of your changes
5. there should be a new file inside `.changeset` folder, review it, add more instructions if needed (for example breaking changes upgrade steps) and commit it
6. push your changes to the repository - PR is ready to be reviewed
