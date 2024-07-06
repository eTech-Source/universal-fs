# Contributing

We are glad you are here! We want to foster contributions that follow a high standard so please read this entire section.

# Tips for contributing

- ALWAYS make an issue before opening a PR
- If the issue already exists make a PR linked to the issue
- ALWAYS link to the specific issue your PR is solving
- PLEASE DO NOT OPEN A PUBLIC ISSUE ABOUT SECURITY FOR SECURITY ISSUES SEE security.md

# The procedure for merges

1. We will make sure it passes all automated checks
2. We will make manual quality control checks
3. We will allow the community to give feedback and for EVERYONE'S feedback to be resolved (the maintainer(s), votes, and original PR opener(s) will decide what feedback will be considered). This will last for about a week unless the issue is urgent
4. The maintainer(s) will decide which version the PR will be included in. The PR will be merged into the version branch.
5. Once the version is released your contribution will be live 🎉

# Checks and standards

## Version control

- Commit messages should follow the conventions shown out in [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- Branch names should not have article adjectives in them. It is recommended to use the auto generated branch names made by GitHub.

## Code quality

- Do not ignore eslint or type errors this will be checked in CI
- Make sure your code is properly formatted (this should be done automatically in a pre-commit hook)

# Tooling

- Rollup for module bundling
- PNPM for managing dependencies
- Express for the file relay server
- Eslint/Prettier for code quality
- Husky for pre-commit hooks
- Nodemon for a live reloading server

# Development setup

## Getting started

_Before these steps make sure you have PNPM and Nodemon installed globally_

1. Fork this project
2. Clone it locally to your machine
3. Run `pnpm install` to install dependencies

## Basic commands

- `pnpm dev` Starts and dev server with live reload functionality
- `pnpm build` Builds the project
- `pnpm prepare` Starts husky
- `pnpm lint:check` Checks for code quality issues
- `pnpm lint:fix` Lints and writes the changes
- `pnpm format:check` Checks if the code is formatted
- `pnpm format:fix` Fixes code style issues

## Project structure

- **.github** This is where GitHub actions code goes
- **.husky** This is where all pre-commit code generation goes
- **dist** This is where the final output of code goes
- **src** This is where all code that directly impacts the core functionality of the library goes
  - **client** This is where all of the operations and authorization of the package goes
  - **helpers** This is where all functions that will be reused but do not relate to the core functionality of the library goes
  - **server** This is where all code for the file relay server goes
- **types** This is where global type overrides goes

# Becoming a maintainer

Please note that becoming a maintainer is different than just contributing. If you would like to become a maintainer start by contributing often with quality contributions. Once you have done that please reach out to ethan@etech.network to become a maintainer. Remember this is NOT a full time job. Just when you have some time to help the community.

Thank you for reading the instructions for contributing. Happy hacking!
