# universal-fs

Allows a client or server to access the file system in the current codebase or a different one.

# The problem

You need to access the file system where the environment is unknown. This could be the client or server.

# The solution

A lightweight fully type-safe package for handling this in the simplest and most secure solution in prod.

universal-fs provides some core Node fs functions in related to the file system module including:

- mkdir
- readdir
- readFile
- rmdir
- unlink
- writeFile

## Comparison with other solutions

| Comparison                                           | universal-fs    | Node fs | vite-plugin-fs |
| ---------------------------------------------------- | --------------- | ------- | -------------- |
| Works outside of Node                                | ✅              | ❌      | ✅             |
| Works outside of Vite                                | ✅              | ✅      | ❌             |
| Works in prod                                        | ✅              | ✅      | ❌             |
| Password protected                                   | ✅              | ❌      | ❌             |
| Multi-language support                               | ✅ <sub>1</sub> | ❌      | ❌             |
| Full Node fs backwards compatibility                 | ✅ <sub>2</sub> | ✅      | ❌             |
| Edge support                                         | ✅              | ❌      | ❌             |
| Access to other codebases file system                | ✅              | ❌      | ❌             |
| Additional functionality outside of standard Node fs | ✅              | ❌      | ❌             |
| Supports all Node fs methods                         | ❌              | ✅      | ❌             |

# Gotcha

`Server.init()` must be called in a Node environment, everything else can be called anywhere. However, this requirement may be removed in a new release.

# Basic usage

## Setup

1. Run `npm install universal-fs`.
2. Create a .env file.
3. Enter any value for `UNIVERSAL_FS_PASSWORD` this will be hashed and used to protect your filesystem.
4. Signup for you [Ngrok](https://dashboard.ngrok.com/get-started/your-authtoken) token
5. Copy the token as an environment variable named `NGROK_AUTHTOKEN`

## In Node

Simply call `init()` with `Server.init()` as a prop.

```ts
import {init, Server, readFile} from "universal-fs";

await init(await Server.init());

await readFile("index.ts");
```

## In the browser

The browser is a little more difficult due to an inability to access `.env` or any server side functionality. Luckily this is what this library is made to solve.

Below is the recommended approach there are other ways to due this. Just make sure you don't leak your password 🥶:

1. Create a route called `/api/fs-init` with following content. Note this example server uses Express you can use the framework of your choosing:

```ts
import {Server} from "universal-fs";

app.get("/api/fs-init", async (req, res) => {
  // Your custom auth code
  const url = await Server.init();
  return res.json({
    url,
    token: encrypt(proccess.env.UNIVERSAL_FS_TOKEN as string) // use the encryption library of your choosing
  });
});
```

**Note this endpoint should not be public!**

2. Call the init function in the browser

```ts
import {init, readFile} from "universal-fs";

const res = await fetch("/api/fs-init");
const data = await res.json();

await init(data.url, decrypt(data.token));

await readFile("index.html");
```

# List of supported methods:

- mkdir
- readdir
- readFile
- rmdir
- unlink
- writeFile

All of these are fully backwards compatible with Node fs promise api.

# Relay file server api

## Obtaining the url and token

### In the browser

Get two cookies one named `universal-fs-url`, and the other `universal-fs-token`.

### In Node

Read two files `.fs/url.txt` and `.fs/token.txt`

_Tip: to get the url and the token you can use the internal helpers `getToken()` and `getUrl()`. You can find them in src/helpers.`_

## Making requests

Send an a fetch request to the following the url fetched.

```ts
await fetch(`${await getUrl()}/path/to/the/file?method=readFile`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${getToken}`
  }
});
```

The method param correspondents to the type of operation. For example mkdir is a POST.

# Additional features

- All operations can be aborted by passing an Abort signal

# Contributing

Contributions are welcome! Please contributing.md for how to contribute.

1. Multi-language support is only possible via the relay file server api. Additionally you project still needs to obtain an access token and the server's url.
2. The whole library is not backwards compatible however, each method works in the exact same way as the Node fs method.
