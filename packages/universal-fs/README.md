<div align="center">
<h1>universal-fs | Use the file system. Anywhere.</h1>
<img src="https://img.shields.io/npm/v/universal-fs" alt="Current stable version">
<img src="https://img.shields.io/npm/types/universal-fs" alt="Type defs">
<img src="https://img.shields.io/npm/l/universal-fs" alt="License">
<img src="https://img.shields.io/npm/dm/universal-fs" alt="Monthly downloads">
<img src="https://img.shields.io/website?url=https%3A%2F%2Funiversal-fs.etech.network" alt="Website status">
</div>

# What is universal-fs

universal-fs is a npm package that enable Node fs functionality outside of Node. You can use universal-fs on the client side or even in completely different programming languages.

# Documentation

- [Introduction](https://universal-fs.etech.network)
- [Getting started](https://universal-fs.etech.network/setup)
- Methods:
  - [What is a method?](https://universal-fs.etech.network/methods)
  - [exists](https://universal-fs.etech.network/methods/exists)
  - [mkdir](https://universal-fs.etech.network/methods/mkdir)
  - [readdir](https://universal-fs.etech.network/methods/readdir)
  - [readFile](https://universal-fs.etech.network/methods/readFile)
  - [rmdir](https://universal-fs.etech.network/methods/rmdir)
  - [unlink](https://universal-fs.etech.network/methods/unlink)
  - [writeFile](https://universal-fs.etech.network/methods/writeFile)
- Configuring universal-fs
  - [Usage without Ngrok](https://universal-fs.etech.network/config/noNgrok)
  - [Using universal-fs without a password](https://universal-fs.etech.network/config/unprotected)
  - [How to use the universal-fs file relay server API](https://universal-fs.etech.network/relayServer)

### [Switch back to the old documentation](https://github.com/eTech-Source/tree/canary/universal-fs/LEGACY_DOCS.md)

# Running the project locally

## You will need

- Git
- Node.js 21+
- pnpm
- Nodemon

## Setup the monorepo for development

- Clone the repo `git clone https://github.com/eTech-Source/universal-fs/tree/canary`
- Install all dependencies `pnpm install`

## A quick tour of the project architecture

### Tech stack

- NX (build system)
- Changeset (versioning)
- pnpm (package manager)
- Rollup (module bundler)
- Eslint/prettier (code quality)

### Project structure

- `.changeset` Where all versioning information is stored
- `.github` Github configuration including CI
- `apps/docs` Documentation site (if you planning on working in this area it has it's own [README](https://github.com/eTech-Source/tree/canary/apps/docs/README.md))
- `packages/universal-fs` The **core** universal-fs package

# Contributing 

Contributions are welcome! For how to contribute please see [CONTRIBUTING](https://github.com/eTech-Source/tree/canary/CONTRIBUTING.md)