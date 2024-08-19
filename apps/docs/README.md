# Welcome to the universal-fs docs

Looking for documentation checkout [universal-fs.etech.network](https://universal-fs.etech.network).

## Run the docs locally

The universal-fs docs is built with the [Next.js pages router](https://nextjs.org/docs/pages) and the [Nextra](https://nextra.site/) static site generator.

To run the docs locally:

- Follow the instructions for installing the universal-fs monorepo in the readme
- Now run `pnpm docs:dev` to preview the site

## Commands

- `pnpm docs:dev` Runs the docs site in dev mode
- `pnpm docs:build` Builds and starts the dev server docs site

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/eTech-Source/universal-fs/tree/canary/apps/docs)

You can also deploy to any other platform by only adding two commands to your deploy script (assuming you are in the docs dir):

```
# Install deps
pnpm install

# Run 
pnpm dev & pnpm start
```

Note that for deployment it is not recommended to deploy the whole monorepo. You should only deploy the docs dir.