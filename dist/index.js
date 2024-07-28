import { isBrowser, isNode } from 'browser-or-node';
import bcrypt from 'bcrypt';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import ngrok from '@ngrok/ngrok';
import process$1 from 'process';

/**
 * Find a cookie by name
 * @param cookieName - The name of the cookie
 * @returns A cookie string or null
 */
const getCookie = (cookieName) => {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
};

/**
 * The auth function called in init
 * @param password - The password to protect the files
 * @see {@link init}
 * @internal
 * @async
 */
const auth = async (password) => {
    if (!process.env.UNIVERSAL_FS_PASSWORD && !password) {
        throw new Error("An environment variable UNIVERSAL_FS_PASSWORD or password prop is required to protect your files");
    }
    if (!password && isBrowser) {
        throw new Error("A password prop is required in browser environments");
    }
    let response;
    if (isBrowser) {
        response = await fetch(getCookie("universal-fs-url") || "", {
            headers: {
                Authorization: `Bearer ${bcrypt.hashSync(password || process.env.UNIVERSAL_FS_PASSWORD, 10)}`
            }
        });
    }
    else if (isNode) {
        response = await fetch(fs.readFileSync(".fs/url.txt", "utf8"), {
            headers: {
                Authorization: `Bearer ${bcrypt.hashSync(password || process.env.UNIVERSAL_FS_PASSWORD, 10)}`
            }
        });
    }
    else {
        throw new Error("Unsupported environment");
    }
    if (response.status !== 401) {
        console.info("Authenticated");
        if (isBrowser) {
            document.cookie = `universal-fs-token=${bcrypt.hashSync(password || process.env.UNIVERSAL_FS_PASSWORD, 10)};`;
        }
        else if (isNode) {
            fs.writeFileSync(".fs/token.txt", bcrypt.hashSync(password || process.env.UNIVERSAL_FS_PASSWORD, 10));
        }
    }
};

/**
 * Check if a string is json
 * @param str The string to check
 * @returns A boolean if true the string is valid otherwise false
 */
const isJson = (str) => {
    try {
        JSON.parse(str);
        return true;
    }
    catch (err) {
        return false;
    }
};

/**
 * The class for controllering the file relay server.
 */
class Server {
    /**
     * The constructor of the class for controllering the file relay server.
     * @param startServer - An optional custom function to use your own Express server
     */
    constructor(options) {
        var _a, _b;
        this.isProtected = true;
        this.app = express();
        this.port = 3000;
        this.startServer = (_a = options === null || options === void 0 ? void 0 : options.startServer) !== null && _a !== void 0 ? _a : undefined;
        this.isProtected = (_b = options === null || options === void 0 ? void 0 : options.isProtected) !== null && _b !== void 0 ? _b : true;
    }
    /**
     * Initilizes the file relay server
     * @returns The url to the open Ngrok tunnel
     * @async
     */
    async init() {
        this.app.use(express.json());
        let authed = false;
        if (this.isProtected) {
            this.app.use((req, res, next) => {
                if (!process$1.env.UNIVERSAL_FS_PASSWORD) {
                    return res.status(401).json({
                        success: false,
                        error: "An environment variable UNIVERSAL_FS_PASSWORD is required to protect your files"
                    });
                }
                if (!req.headers.authorization) {
                    return res.status(401).json({
                        success: false,
                        error: "An Authorization header is required"
                    });
                }
                const token = req.headers.authorization.replace(/^Bearer\s/, "");
                if (!bcrypt.compareSync(process$1.env.UNIVERSAL_FS_PASSWORD, token)) {
                    return res.status(401).json({
                        success: false,
                        error: "Unauthorized request"
                    });
                }
                authed = true;
                next();
            });
        }
        this.app.use((req, res, next) => {
            if (!authed &&
                (req.query.method === "writeFile" ||
                    req.query.method === "mkdir" ||
                    req.query.method === "unlink" ||
                    req.query.method === "rmdir")) {
                throw new Error("ILLEGAL METHOD: you cannot use write or delete on a non-protected server");
            }
            const ignoredFile = fs.readFileSync(".gitignore", "utf8").split("\n");
            for (const file of ignoredFile) {
                if (file === req.params.path) {
                    return res.status(403).json({
                        error: "The requested resource is not avabile"
                    });
                }
            }
            if (!req.query.method || req.query.method === "") {
                return res.status(422).json({
                    error: "A method is required"
                });
            }
            if (req.method === "POST" && !req.body) {
                return res.status(422).json({
                    error: "A body is required on post requests"
                });
            }
            next();
        });
        this.app.get("/:path", async (req, res) => {
            switch (req.query.method) {
                case "readFile":
                    let fileOptions = null;
                    let fileBuffer = null;
                    if (isJson(req.headers.options)) {
                        fileOptions = JSON.parse(req.headers.options);
                    }
                    try {
                        fileBuffer = fs.readFileSync(req.params.path, fileOptions);
                        return res.json({ success: true, buffer: fileBuffer });
                    }
                    catch (err) {
                        return res.status(500).json({ success: false, error: err });
                    }
                case "readdir":
                    let dirs = null;
                    let dirOptions = null;
                    if (isJson(req.headers.options)) {
                        dirOptions = JSON.parse(req.headers.options);
                    }
                    try {
                        dirs = fs.readdirSync(req.params.path, dirOptions);
                        return res.json({ success: true, dirs: dirs });
                    }
                    catch (err) {
                        return res.status(500).json({ success: false, error: err });
                    }
                case "exists":
                    try {
                        const exists = fs.existsSync(req.params.path);
                        return res.json({ success: true, exists: exists });
                    }
                    catch (err) {
                        return res.status(500).json({ success: false, error: err });
                    }
                default:
                    // This should never trigger because of the first check
                    return res.status(422).json({ error: "Method not found" });
            }
        });
        this.app.post("/:path", (req, res) => {
            switch (req.query.method) {
                case "writeFile":
                    let writeOptions;
                    if (isJson(req.headers.options)) {
                        writeOptions = JSON.parse(req.headers.options);
                    }
                    try {
                        fs.writeFileSync(req.params.path, req.body.contents, writeOptions);
                        return res
                            .status(200)
                            .json({ success: true, message: "File written" });
                    }
                    catch (err) {
                        return res.status(500).json({ success: false, error: err });
                    }
                case "mkdir":
                    let mkdirOptions = null;
                    if (isJson(req.headers.options)) {
                        mkdirOptions = JSON.parse(req.headers.options);
                    }
                    try {
                        fs.mkdirSync(req.params.path, mkdirOptions);
                        return res
                            .status(200)
                            .json({ success: true, message: "Directory created" });
                    }
                    catch (err) {
                        return res.status(500).json({ success: false, error: err });
                    }
                default:
                    return res.status(422).json({ error: "Method not found" });
            }
        });
        this.app.delete("/:path", (req, res) => {
            switch (req.query.method) {
                case "unlink":
                    try {
                        fs.unlinkSync(req.params.path);
                        return res
                            .status(200)
                            .json({ success: true, message: "File deleted" });
                    }
                    catch (err) {
                        return res.status(500).json({ success: false, error: err });
                    }
                case "rmdir":
                    let rmOptions = undefined;
                    if (isJson(req.headers.options)) {
                        rmOptions = JSON.parse(req.headers.options);
                    }
                    try {
                        fs.rmdirSync(req.params.path, rmOptions);
                        return res
                            .status(200)
                            .json({ success: true, message: "Directory deleted" });
                    }
                    catch (err) {
                        return res.status(500).json({ success: false, error: err });
                    }
                default:
                    return res.status(422).json({ error: "Method not found" });
            }
        });
        if (this.startServer) {
            let customUrl;
            if (this.startServer.length === 0) {
                throw new Error("A startServer function must accpet at least one argument");
            }
            else if (this.startServer.length === 1) {
                customUrl = await this.startServer(this.app);
            }
            else if (this.startServer.length >= 3) {
                throw new Error("StartServer has too many arguments");
            }
            else {
                customUrl = await this.startServer(this.app, this.server);
            }
            if (!customUrl) {
                throw new Error("StartServer must return a url");
            }
            return customUrl;
        }
        try {
            this.server = this.app.listen(this.port, () => {
                console.info(`Listening on this.port ${this.port}`);
            });
        }
        catch (err) {
            if (err.code === "EADDRINUSE") {
                console.info(`this.port ${this.port} is already in use. Trying to connect on this.port ${this.port++}`);
                this.port = this.port++;
            }
        }
        const listener = await ngrok.connect({
            addr: this.port,
            authtoken: process$1.env.NGROK_AUTHTOKEN
        });
        return listener.url();
    }
    /**
     * Stops the server by closing the current connection.
     */
    stop() {
        this.server.close();
    }
}

const getUrl = async () => {
    let url;
    if (isBrowser) {
        url = getCookie("universal-fs-url");
    }
    else if (isNode) {
        const fs = await import('fs');
        url = fs.readFileSync(".fs/url.txt", "utf8");
    }
    return url;
};

const getTokenSync = async () => {
    if (isBrowser) {
        return getCookie("universal-fs-token");
    }
    else if (isNode) {
        const fs = await import('fs');
        return fs.readFileSync(".fs/token.txt", "utf8");
    }
};

const pollyfillBuffer = async () => {
    let BufferPolyfill;
    if (isBrowser) {
        BufferPolyfill = (await import('buffer/')).Buffer;
    }
    else if (isNode) {
        BufferPolyfill = Buffer;
    }
    else {
        throw new Error("Failed to pollyfill Buffer. Unsupported environment");
    }
    return BufferPolyfill;
};

/**
 * Asynchronously reads the entire contents of a file.

If no encoding is specified (using options.encoding), the data is returned as a Buffer object. Otherwise, the data will be a string.

If options is a string, then it specifies the encoding.

When the path is a directory, the behavior of fsPromises.readFile() is platform-specific. On macOS, Linux, and Windows, the promise will be rejected with an error. On FreeBSD, a representation of the directory's contents will be returned.

An example of reading a package.json file located in the same directory of the running code:

```js
import { readFile } from 'universal-fs';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

It is possible to abort an ongoing readFile using an AbortSignal. If a request is aborted the promise returned is rejected with an AbortError:

```js
import { readFile } from 'universal-fs';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```

Aborting an ongoing request does not abort individual operating system requests but rather the internal buffering fs.readFile performs.

Any specified FileHandle has to support reading.

@since universal-fs V1.0.0 | Node.js v10.0.0
@param path filename or FileHandle
@param options Read options
@return Fulfills with the contents of the file.
@async
 */
const readFile = async (path, options) => {
    const url = await getUrl();
    try {
        const response = await fetch(`${url}/${path}?method=readFile`, {
            signal: options === null || options === void 0 ? void 0 : options.signal,
            headers: {
                Authorization: `Bearer ${await getTokenSync()}`,
                options: JSON.stringify(options)
            }
        });
        const { buffer } = await response.json();
        if (!(options === null || options === void 0 ? void 0 : options.encoding)) {
            return buffer;
        }
        const BufferPolyfill = await pollyfillBuffer();
        return BufferPolyfill.from(buffer).toString(options === null || options === void 0 ? void 0 : options.encoding);
    }
    catch (err) {
        throw err;
    }
};

/**
 * Reads the contents of a directory.
 *
 * The optional `options` argument can be a string specifying an encoding, or an
 * object with an `encoding` property specifying the character encoding to use for
 * the filenames. If the `encoding` is set to `'buffer'`, the filenames returned
 * will be passed as `Buffer` objects.
 *
 * If `options.withFileTypes` is set to `true`, the returned array will contain `fs.Dirent` objects.
 *
 * ```js
 * import { readdir } from 'universal-fs';
 *
 * try {
 *   const files = await readdir(path);
 *   for (const file of files)
 *     console.log(file);
 * } catch (err) {
 *   console.error(err);
 * }
 * ```
 *
 * Note: Abortable is not present in the Node.js API.
 *
 * @since universal-fs V1.0.0 | Node.js v10.0.0
 * @return Fulfills with an array of the names of the files in the directory excluding `'.'` and `'..'`.
 * @async
 */
const readdir = async (path, options) => {
    const url = await getUrl();
    try {
        const response = await fetch(`${url}/${path}?method=readdir`, {
            signal: options === null || options === void 0 ? void 0 : options.signal,
            headers: {
                Authorization: `Bearer ${await getTokenSync()}`,
                options: JSON.stringify(options)
            }
        });
        const { dirs } = await response.json();
        return dirs;
    }
    catch (err) {
        throw err;
    }
};

/**
 * Asynchronously writes data to a file, replacing the file if it already exists. `data` can be a string, a buffer, an
 * [AsyncIterable](https://tc39.github.io/ecma262/#sec-asynciterable-interface), or an
 * [Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) object.
 *
 * The `encoding` option is ignored if `data` is a buffer.
 *
 * If `options` is a string, then it specifies the encoding.
 *
 * The `mode` option only affects the newly created file. See `fs.open()` for more details.
 *
 * Any specified `FileHandle` has to support writing.
 *
 * It is unsafe to use `fsPromises.writeFile()` multiple times on the same file
 * without waiting for the promise to be settled.
 *
 * Similarly to `fsPromises.readFile` \- `fsPromises.writeFile` is a convenience
 * method that performs multiple `write` calls internally to write the buffer
 * passed to it. For performance sensitive code consider using `fs.createWriteStream()` or `filehandle.createWriteStream()`.
 *
 * It is possible to use an `AbortSignal` to cancel an `fsPromises.writeFile()`.
 * ~~Cancelation is "best effort", and some amount of data is likely still
 * to be written.~~ universal-fs uses fetch requests under the hood. I request can be aborted but beyond a certain point it can no longer be aborted.
 *
 * ```js
 * import { writeFile } from 'universal-fs';
 * import { Buffer } from 'node:buffer';
 *
 * try {
 *   const controller = new AbortController();
 *   const { signal } = controller;
 *   const promise = writeFile('message.txt', 'Hello Node.js', { signal });
 *
 *   // Abort the request before the promise settles.
 *   controller.abort();
 *
 *   await promise;
 * } catch (err) {
 *   // When a request is aborted - err is an AbortError
 *   console.error(err);
 * }
 * ```
 *
 * Aborting an ongoing request does not abort individual operating
 * system requests but rather the internal buffering `fs.writeFile` performs.
 * @since universal-fs v1.0.0 | Node.js v10.0.0
 * @param file filename or `FileHandle`
 * @return Fulfills with `undefined` upon success.
 * @async
 */
const writeFile = async (path, data, options) => {
    const url = await getUrl();
    try {
        const response = await fetch(`${url}/${path}?method=writeFile`, {
            signal: options === null || options === void 0 ? void 0 : options.signal,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${await getTokenSync()}`,
                "options": JSON.stringify(options),
                "content-type": "application/json"
            },
            body: JSON.stringify({ contents: data })
        });
    }
    catch (err) {
        throw err;
    }
};

/**
 * Asynchronously creates a directory.
 *
 * The optional `options` argument can be an integer specifying `mode` (permission
 * and sticky bits), or an object with a `mode` property and a `recursive` property indicating whether parent directories should be created. Calling `fsPromises.mkdir()` when `path` is a directory
 * that exists results in a
 * rejection only when `recursive` is false.
 *
 * ```js
 * import { mkdir } from 'universal-fs';
 *
 * try {
 *   const projectFolder = new URL('./test/project/', import.meta.url);
 *   const createDir = await mkdir(projectFolder, { recursive: true });
 *
 *   console.log(`created ${createDir}`);
 * } catch (err) {
 *   console.error(err.message);
 * }
 * ```
 *
 * *Note: In universal-fs you can abortate a request using AbortController*
 *
 * @since universal-fs V1.0.0 | Node.js v10.0.0
 * @return Upon success, fulfills with `undefined` if `recursive` is `false`, or the first directory path created if `recursive` is `true`.
 */
const mkdir = async (path, options) => {
    const url = await getUrl();
    try {
        await fetch(`${url}/${path}?method=mkdir`, {
            method: "POST",
            signal: options === null || options === void 0 ? void 0 : options.signal,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await getTokenSync()}`,
                "options": JSON.stringify(options)
            }
        });
    }
    catch (err) {
        throw err;
    }
};

/**
 * If `path` refers to a symbolic link, then the link is removed without affecting
 * the file or directory to which that link refers. If the `path` refers to a file
 * path that is not a symbolic link, the file is deleted. See the POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2.html) documentation for more detail.
 *
 * *Note: In universal-fs you can abortate a request using AbortController*
 *
 * @since universal-fs V1.0.0 | Node.js v10.0.0
 * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param options An Abortable
 * @see {@link Abortable}
 * @return Fulfills with ~~`undefined`~~ `void` upon success.
 */
const unlink = async (path, options) => {
    const url = await getUrl();
    try {
        await fetch(`${url}/${path}?method=unlink`, {
            signal: options === null || options === void 0 ? void 0 : options.signal,
            method: "DELETE"
        });
    }
    catch (err) {
        throw err;
    }
};

/**
 * Removes the directory identified by `path`.
 *
 * Using `fsPromises.rmdir()` on a file (not a directory) results in the
 * promise being rejected with an `ENOENT` error on Windows and an `ENOTDIR` error on POSIX.
 *
 * To get a behavior similar to the `rm -rf` Unix command, use `fsPromises.rm()` with options `{ recursive: true, force: true }`.
 * @since universal-fs V1.0.0 | Node.js v10.0.0
 * @return Fulfills with ~~`undefined`~~ `void` upon success.
 */
const rmdir = async (path, options) => {
    const url = await getUrl();
    try {
        await fetch(`${url}/${path}`, {
            signal: options === null || options === void 0 ? void 0 : options.signal,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${await getTokenSync()}`,
                options: JSON.stringify(options)
            }
        });
    }
    catch (err) {
        throw err;
    }
};

/**
 * A modern implementation of the Node fs @see{@link exists} API.
 * Returns `true` if the path exists, `false` otherwise in promise form.
 *
 * Usage:
 * ```ts
 * import { exists } from 'universal-fs';
 *
 * const hasFoundFile = await exists('/path/to/file.txt');
 * ```
 *
 * You can also abort an outgoing request using an AbortSignal. If a request is aborted the promise returned is rejected with an AbortError:
 * ```ts
 *
 * import { exists } from 'universal-fs';
 *
 * const controller = new AbortController();
 * const { signal } = controller;
 *
 * const hasFoundFile = await exists('/path/to/file.txt', { signal });
 *
 * controller.abort();
 * ```
 */
const exists = async (path, options) => {
    const url = await getUrl();
    try {
        const response = await fetch(`${url}/${path}?method=exists`, {
            signal: options === null || options === void 0 ? void 0 : options.signal,
            headers: {
                Authorization: `Bearer ${await getTokenSync()}`
            }
        });
        const { exists } = await response.json();
        return exists;
    }
    catch (err) {
        throw err;
    }
};

dotenv.config({ path: ".env" });
/**
 * Initialize the connection to the relay server. Avabile in most JS environments
 * @param url - The url of the relay server
 * @param password - The password to protect the files
 * @async
 */
const init = async (url, password, isProtected) => {
    const response = await fetch(url);
    if (response.status === 404) {
        throw new Error("Relay server not found");
    }
    if (isBrowser) {
        document.cookie = `universal-fs-url=${url};`;
    }
    else if (isNode) {
        if (!fs.existsSync(".fs")) {
            console.info("No .fs directory found. Creating .fs directory");
            fs.mkdirSync(".fs");
        }
        fs.writeFileSync(".fs/url.txt", url);
    }
    if (isProtected) {
        await auth(password);
    }
};

export { Server, auth, exists, init, mkdir, readFile, readdir, rmdir, unlink, writeFile };
