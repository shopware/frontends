# Contribution

## Commits

We aim to follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format for our commits, but at the end, the PR title matters the most as we squash all commits into one when merging PRs.

### Linting and formatting

We're using git hook to run linting and formatting before each commit. You can run them manually by running `pnpm lint` and `pnpm format`.

### IDE support

If your IDE is showing error on commit like `node: command not found`, you can fix it by running the project from the terminal.

```bash
cd ./frontends
code .
# or
cursor .
# or wny other
```

## Changelog preparation

In order to keep track of the changes inside project we do use `changesets` package to generate changelogs. After you created some changes follow these steps:

1. run `pnpm changeset`
2. pick packages inside which you made changes
3. pick packages for `major`, `minor` or `patch` version bump depending on your changes
4. write a short description of your changes
5. there should be a new file inside `.changeset` folder, review it, add more instructions if needed (for example breaking changes upgrade steps) and commit it
6. push your changes to the repository - PR is ready to be reviewed

## Creating Pull Request

### Conventional Pull Request title

We're using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to keep our commit messages consistent. However to avoid having too much noise, we're squashing all commits into one when merging PRs.
That's why the PR title is the commit message for the whole PR. Please make sure to follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format when creating a PR title. We do have a GitHub Action that will check if the PR title is valid.

## Agent instruction files

`AGENTS.md` is what AI coding agents read. Most agents pick up the nearest one
in the directory tree on their own; Claude Code reads `CLAUDE.md` instead, so
every `AGENTS.md` has a one-line `CLAUDE.md` beside it containing `@AGENTS.md`.
**Add both files together** — an `AGENTS.md` without its `CLAUDE.md` sibling is
invisible to Claude Code, and a gotcha filed there never reaches the session
that needed it. Only the root pair loads at session start; a nested one is
picked up when the agent works on files in that directory, which is exactly what
you want for package-specific notes.

**Keep the root pair under 200 lines.** It is resident in every session, and
past that size it costs more context and gets followed less — the budget is a
correctness rule there, not tidiness. Nested files are bounded by relevance
instead: they only load in their own subtree, so moving package detail down out
of the root file is a real saving, not a reshuffle.

Limit them to what an agent cannot derive by reading the repo: gotchas,
rationale, and conventions that differ from tool defaults. Layouts, dependency
lists, standard scripts and component inventories belong in the code or the docs
site. Prefer pointing at the file that owns a fact over restating it — a
condensed copy in an instruction file drifts from the original, and the original
is the one with an owner. Update them in the same change that makes them wrong.

## Documenting code

Exported functions and types get a JSDoc block; that is what surfaces in
consumers' editors.
