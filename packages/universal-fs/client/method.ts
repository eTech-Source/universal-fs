import getUrl from "../helpers/getUrl";

const sendMethod = async (method: string, ...args: any[]) => {
  const response = await fetch(`${await getUrl()}/fs`, {
    headers: {
      method: method,
      args: JSON.stringify(args)
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data);
  }

  return data;
};

/**
 * Tests a user's permissions for the file or directory specified by `path`.
 * The `mode` argument is an optional integer that specifies the accessibility
 * checks to be performed. `mode` should be either the value `fs.constants.F_OK` or a mask consisting of the bitwise OR of any of `fs.constants.R_OK`, `fs.constants.W_OK`, and `fs.constants.X_OK`
 * (e.g.`fs.constants.W_OK | fs.constants.R_OK`). Check `File access constants` for
 * possible values of `mode`.
 *
 * If the accessibility check is successful, the promise is fulfilled with no
 * value. If any of the accessibility checks fail, the promise is rejected
 * with an [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object. The following example checks if the file`/etc/passwd` can be read and
 * written by the current process.
 *
 * ```js
 * import { access, constants } from 'node:fs/promises';
 *
 * try {
 *   await access('/etc/passwd', constants.R_OK | constants.W_OK);
 *   console.log('can access');
 * } catch {
 *   console.error('cannot access');
 * }
 * ```
 *
 * Using `fsPromises.access()` to check for the accessibility of a file before
 * calling `fsPromises.open()` is not recommended. Doing so introduces a race
 * condition, since other processes may change the file's state between the two
 * calls. Instead, user code should open/read/write the file directly and handle
 * the error raised if the file is not accessible.
 * @since v10.0.0
 * @param [mode=fs.constants.F_OK]
 * @return Fulfills with `undefined` upon success.
 */
export async function access(path: PathLike, mode?: number): Promise<void> {
  return await sendMethod("access", path, mode);
}

/**
 * Equivalent to `fsPromises.stat()` unless `path` refers to a symbolic link,
 * in which case the link itself is stat-ed, not the file that it refers to.
 * Refer to the POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2.html) document for more detail.
 * @since v10.0.0
 * @return Fulfills with the {fs.Stats} object for the given symbolic link `path`.
 */
export async function lstat(
  path: PathLike,
  opts?: StatOptions & {
    bigint?: false | undefined;
  }
): Promise<unknown> {
  return await sendMethod("lstat", path, opts);
}

/**
 * @since v10.0.0
 * @return Fulfills with the {fs.Stats} object for the given `path`.
 */
export async function stat(
  path: PathLike,
  opts?: StatOptions & {
    bigint?: false | undefined;
  }
): Promise<unknown> {
  return await sendMethod("stat", path, opts);
}

/**
 * Asynchronously reads the entire contents of a file.
 *
 * If no encoding is specified (using `options.encoding`), the data is returned
 * as a `Buffer` object. Otherwise, the data will be a string.
 *
 * If `options` is a string, then it specifies the encoding.
 *
 * When the `path` is a directory, the behavior of `fsPromises.readFile()` is
 * platform-specific. On macOS, Linux, and Windows, the promise will be rejected
 * with an error. On FreeBSD, a representation of the directory's contents will be
 * returned.
 *
 * An example of reading a `package.json` file located in the same directory of the
 * running code:
 *
 * ```js
 * import { readFile } from 'node:fs/promises';
 * try {
 *   const filePath = new URL('./package.json', import.meta.url);
 *   const contents = await readFile(filePath, { encoding: 'utf8' });
 *   console.log(contents);
 * } catch (err) {
 *   console.error(err.message);
 * }
 * ```
 *
 * It is possible to abort an ongoing `readFile` using an `AbortSignal`. If a
 * request is aborted the promise returned is rejected with an `AbortError`:
 *
 * ```js
 * import { readFile } from 'node:fs/promises';
 *
 * try {
 *   const controller = new AbortController();
 *   const { signal } = controller;
 *   const promise = readFile(fileName, { signal });
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
 * system requests but rather the internal buffering `fs.readFile` performs.
 *
 * Any specified `FileHandle` has to support reading.
 * @since v10.0.0
 * @param path filename or `FileHandle`
 * @return Fulfills with the contents of the file.
 */
export async function readFile(
  path: PathLike | FileHandle,
  options?:
    | ({
        encoding?: null | undefined | BufferEncoding;
        flag?: OpenMode | undefined;
      } & Abortable)
    | null
): Promise<Buffer> {
  return await sendMethod("readFile", path, options);
}

console.log(await readFile("./package.json", {encoding: "utf8"}));

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
 * import { readdir } from 'node:fs/promises';
 *
 * try {
 *   const files = await readdir(path);
 *   for (const file of files)
 *     console.log(file);
 * } catch (err) {
 *   console.error(err);
 * }
 * ```
 * @since v10.0.0
 * @return Fulfills with an array of the names of the files in the directory excluding `'.'` and `'..'`.
 */
export async function readdir(
  path: PathLike,
  options?:
    | (ObjectEncodingOptions & {
        withFileTypes?: false | undefined;
        recursive?: boolean | undefined;
      })
    | BufferEncoding
    | null
): Promise<string[]> {
  return await sendMethod("readdir", path, options);
}

/**
 * Reads the contents of the symbolic link referred to by `path`. See the POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2.html) documentation for more detail. The promise is
 * fulfilled with the`linkString` upon success.
 *
 * The optional `options` argument can be a string specifying an encoding, or an
 * object with an `encoding` property specifying the character encoding to use for
 * the link path returned. If the `encoding` is set to `'buffer'`, the link path
 * returned will be passed as a `Buffer` object.
 * @since v10.0.0
 * @return Fulfills with the `linkString` upon success.
 */
export async function readlink(
  path: PathLike,
  options?: ObjectEncodingOptions | BufferEncoding | null
): Promise<string> {
  return await sendMethod("readlink", path, options);
}

/**
 export * Determines the actual location of `path` using the same semantics as the `fs.realpath.native()` async function.
 *
 * Only paths that can be converted to UTF8 strings are supported.
 *
 * The optional `options` argument can be a string specifying an encoding, or an
 * object with an `encoding` property specifying the character encoding to use for
 * the path. If the `encoding` is set to `'buffer'`, the path returned will be
 * passed as a `Buffer` object.
 *
 * On Linux, when Node.js is linked against musl libc, the procfs file system must
 export * be mounted on `/proc` in order for this async function to work. Glibc does not have
 * this restriction.
 * @since v10.0.0
 * @return Fulfills with the resolved path upon success.
 */
export async function realpath(
  path: PathLike,
  options?: ObjectEncodingOptions | BufferEncoding | null
): Promise<string> {
  return await sendMethod("realpath", path, options);
}

/**
 * Returns an async iterator that watches for changes on `filename`, where `filename`is either a file or a directory.
 *
 * ```js
 * const { watch } = require('node:fs/promises');
 *
 * const ac = new AbortController();
 * const { signal } = ac;
 * setTimeout(() => ac.abort(), 10000);
 *
 * (async () => {
 *   try {
 *     const watcher = watch(__filename, { signal });
 *     for await (const event of watcher)
 *       console.log(event);
 *   } catch (err) {
 *     if (err.name === 'AbortError')
 *       return;
 *     throw err;
 *   }
 * })();
 * ```
 *
 * On most platforms, `'rename'` is emitted whenever a filename appears or
 * disappears in the directory.
 *
 * All the `caveats` for `fs.watch()` also apply to `fsPromises.watch()`.
 * @since v15.9.0, v14.18.0
 * @return of objects with the properties:
 */
export async function watch(
  filename: PathLike,
  options:
    | (WatchOptions & {
        encoding: "buffer";
      })
    | "buffer"
): Promise<AsyncIterable<FileChangeInfo<Buffer>>> {
  return await sendMethod("watch", filename, options);
}

/**
 * Asynchronously open a directory for iterative scanning. See the POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3.html) documentation for more detail.
 *
 export * Creates an `fs.Dir`, which contains all further async functions for reading from
 * and cleaning up the directory.
 *
 * The `encoding` option sets the encoding for the `path` while opening the
 * directory and subsequent read operations.
 *
 * Example using async iteration:
 *
 * ```js
 * import { opendir } from 'node:fs/promises';
 *
 * try {
 *   const dir = await opendir('./');
 *   for await (const dirent of dir)
 *     console.log(dirent.name);
 * } catch (err) {
 *   console.error(err);
 * }
 * ```
 *
 * When using the async iterator, the `fs.Dir` object will be automatically
 * closed after the iterator exits.
 * @since v12.12.0
 * @return Fulfills with an {fs.Dir}.
 */
export async function opendir(
  path: PathLike,
  options?: OpenDirOptions
): Promise<Dir> {
  return await sendMethod("opendir", path, options);
}

/**
 * Modifies the permissions on the file. See [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2.html).
 * @since v10.0.0
 * @param mode the file mode bit mask.
 * @return Fulfills with `undefined` upon success.
 */
export async function chmod(mode: Mode): Promise<void> {
  return await sendMethod("chmod", mode);
}

/**
 * Changes the ownership of a file.
 * @since v10.0.0
 * @return Fulfills with `undefined` upon success.
 */
export async function chown(
  path: PathLike,
  uid: number,
  gid: number
): Promise<void> {
  return await sendMethod("chown", path, uid, gid);
}

/**
 * Changes the ownership on a symbolic link.
 * @since v10.0.0
 * @return Fulfills with `undefined` upon success.
 */
export async function lchown(
  path: PathLike,
  uid: number,
  gid: number
): Promise<void> {
  return await sendMethod("lchown", path, uid, gid);
}

/**
 * Change the file system timestamps of the object referenced by `path`.
 *
 * The `atime` and `mtime` arguments follow these rules:
 *
 * * Values can be either numbers representing Unix epoch time, `Date`s, or a
 * numeric string like `'123456789.0'`.
 * * If the value can not be converted to a number, or is `NaN`, `Infinity`, or `-Infinity`, an `Error` will be thrown.
 * @since v10.0.0
 * @return Fulfills with `undefined` upon success.
 */
export async function utimes(
  path: PathLike,
  atime: TimeLike,
  mtime: TimeLike
): Promise<void> {
  return await sendMethod("utimes", path, atime, mtime);
}

/**
 * Changes the access and modification times of a file in the same way as `fsPromises.utimes()`, with the difference that if the path refers to a
 * symbolic link, then the link is not dereferenced: instead, the timestamps of
 * the symbolic link itself are changed.
 * @since v14.5.0, v12.19.0
 * @return Fulfills with `undefined` upon success.
 */
export async function lutimes(
  path: PathLike,
  atime: TimeLike,
  mtime: TimeLike
): Promise<void> {
  return await sendMethod("lutimes", path, atime, mtime);
}

/**
 * Truncates the file.
 *
 * If the file was larger than `len` bytes, only the first `len` bytes will be
 * retained in the file.
 *
 * The following example retains only the first four bytes of the file:
 *
 * ```js
 * import { open } from 'node:fs/promises';
 *
 * let filehandle = null;
 * try {
 *   filehandle = await open('temp.txt', 'r+');
 *   await filehandle.truncate(4);
 * } finally {
 *   await filehandle?.close();
 * }
 * ```
 *
 * If the file previously was shorter than `len` bytes, it is extended, and the
 * extended part is filled with null bytes (`'\0'`):
 *
 * If `len` is negative then `0` will be used.
 * @since v10.0.0
 * @param [len=0]
 * @return Fulfills with `undefined` upon success.
 */
export async function truncate(len?: number): Promise<void> {
  return await sendMethod("truncate", len);
}

/**
 * Asynchronously writes data to a file, replacing the file if it already exists. `data` can be a string, a buffer, an
 * [AsyncIterable](https://tc39.github.io/ecma262/#sec-asynciterable-interface), or an
 * [Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) object.
 * The promise is fulfilled with no arguments upon success.
 *
 * If `options` is a string, then it specifies the `encoding`.
 *
 * The `FileHandle` has to support writing.
 *
 * It is unsafe to use `filehandle.writeFile()` multiple times on the same file
 * without waiting for the promise to be fulfilled (or rejected).
 *
 * If one or more `filehandle.write()` calls are made on a file handle and then a`filehandle.writeFile()` call is made, the data will be written from the
 * current position till the end of the file. It doesn't always write from the
 * beginning of the file.
 * @since v10.0.0
 */
export async function writeFile(
  data: string | Uint8Array,
  options?:
    | (ObjectEncodingOptions &
        FlagAndOpenMode &
        Abortable & {flush?: boolean | undefined})
    | BufferEncoding
    | null
): Promise<void> {
  return await sendMethod("writeFile", data, options);
}

/**
 * Asynchronously append data to a file, creating the file if it does not yet
 * exist. `data` can be a string or a `Buffer`.
 *
 * If `options` is a string, then it specifies the `encoding`.
 *
 * The `mode` option only affects the newly created file. See `fs.open()` for more details.
 *
 * The `path` may be specified as a `FileHandle` that has been opened
 * for appending (using `fsPromises.open()`).
 * @since v10.0.0
 * @param path filename or {FileHandle}
 * @return Fulfills with `undefined` upon success.
 */
export async function appendFile(
  path: PathLike | FileHandle,
  data: string | Uint8Array,
  options?:
    | (ObjectEncodingOptions & FlagAndOpenMode & {flush?: boolean | undefined})
    | BufferEncoding
    | null
): Promise<void> {
  return await sendMethod("appendFile", path, data, options);
}

/**
 * Asynchronously creates a directory.
 *
 * The optional `options` argument can be an integer specifying `mode` (permission
 * and sticky bits), or an object with a `mode` property and a `recursive` property indicating whether parent directories should be created. Calling `fsPromises.mkdir()` when `path` is a directory
 * that exists results in a
 * rejection only when `recursive` is false.
 *
 * ```js
 * import { mkdir } from 'node:fs/promises';
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
 * @since v10.0.0
 * @return Upon success, fulfills with `undefined` if `recursive` is `false`, or the first directory path created if `recursive` is `true`.
 */
export async function mkdir(
  path: PathLike,
  options: MakeDirectoryOptions & {
    recursive: true;
  }
): Promise<string | undefined> {
  return await sendMethod("mkdir", path, options);
}

/**
 * Creates a unique temporary directory. A unique directory name is generated by
 * appending six random characters to the end of the provided `prefix`. Due to
 * platform inconsistencies, avoid trailing `X` characters in `prefix`. Some
 * platforms, notably the BSDs, can return more than six random characters, and
 * replace trailing `X` characters in `prefix` with random characters.
 *
 * The optional `options` argument can be a string specifying an encoding, or an
 * object with an `encoding` property specifying the character encoding to use.
 *
 * ```js
 * import { mkdtemp } from 'node:fs/promises';
 * import { join } from 'node:path';
 * import { tmpdir } from 'node:os';
 *
 * try {
 *   await mkdtemp(join(tmpdir(), 'foo-'));
 * } catch (err) {
 *   console.error(err);
 * }
 * ```
 *
 * The `fsPromises.mkdtemp()` method will append the six randomly selected
 * characters directly to the `prefix` string. For instance, given a directory `/tmp`, if the intention is to create a temporary directory _within_ `/tmp`, the `prefix` must end with a trailing
 * platform-specific path separator
 * (`require('node:path').sep`).
 * @since v10.0.0
 * @return Fulfills with a string containing the file system path of the newly created temporary directory.
 */
export async function mkdtemp(
  prefix: string,
  options?: ObjectEncodingOptions | BufferEncoding | null
): Promise<string> {
  return await sendMethod("mkdtemp", prefix, options);
}

/**
 * Opens a `FileHandle`.
 *
 * Refer to the POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2.html) documentation for more detail.
 *
 * Some characters (`< > : " / \ | ? *`) are reserved under Windows as documented
 * by [Naming Files, Paths, and Namespaces](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). Under NTFS, if the filename contains
 * a colon, Node.js will open a file system stream, as described by [this MSDN page](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).
 * @since v10.0.0
 * @param [flags='r'] See `support of file system `flags``.
 * @param [mode=0o666] Sets the file mode (permission and sticky bits) if the file is created.
 * @return Fulfills with a {FileHandle} object.
 */
export async function open(
  path: PathLike,
  flags?: string | number,
  mode?: Mode
): Promise<FileHandle> {
  return await sendMethod("open", path, flags, mode);
}

/**
 * Creates a symbolic link.
 *
 * The `type` argument is only used on Windows platforms and can be one of `'dir'`, `'file'`, or `'junction'`. If the `type` argument is not a string, Node.js will
 * autodetect `target` type and use `'file'` or `'dir'`. If the `target` does not
 * exist, `'file'` will be used. Windows junction points require the destination
 * path to be absolute. When using `'junction'`, the `target` argument will
 * automatically be normalized to absolute path. Junction points on NTFS volumes
 * can only point to directories.
 * @since v10.0.0
 * @param [type='null']
 * @return Fulfills with `undefined` upon success.
 */
export async function symlink(
  target: PathLike,
  path: PathLike,
  type?: string | null
): Promise<void> {
  return await sendMethod("symlink", target, path, type);
}

/**
 * Creates a new link from the `existingPath` to the `newPath`. See the POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2.html) documentation for more detail.
 * @since v10.0.0
 * @return Fulfills with `undefined` upon success.
 */
export async function link(
  existingPath: PathLike,
  newPath: PathLike
): Promise<void> {
  return await sendMethod("link", existingPath, newPath);
}

/**
 * Asynchronously copies `src` to `dest`. By default, `dest` is overwritten if it
 * already exists.
 *
 * No guarantees are made about the atomicity of the copy operation. If an
 * error occurs after the destination file has been opened for writing, an attempt
 * will be made to remove the destination.
 *
 * ```js
 * import { copyFile, constants } from 'node:fs/promises';
 *
 * try {
 *   await copyFile('source.txt', 'destination.txt');
 *   console.log('source.txt was copied to destination.txt');
 * } catch {
 *   console.error('The file could not be copied');
 * }
 *
 * // By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
 * try {
 *   await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
 *   console.log('source.txt was copied to destination.txt');
 * } catch {
 *   console.error('The file could not be copied');
 * }
 * ```
 * @since v10.0.0
 * @param src source filename to copy
 * @param dest destination filename of the copy operation
 * @param [mode=0] Optional modifiers that specify the behavior of the copy operation. It is possible to create a mask consisting of the bitwise OR of two or more values (e.g.
 * `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`)
 * @return Fulfills with `undefined` upon success.
 */
export async function copyFile(
  src: PathLike,
  dest: PathLike,
  mode?: number
): Promise<void> {
  return await sendMethod("copyFile", src, dest, mode);
}

/**
 * Asynchronously copies the entire directory structure from `src` to `dest`,
 * including subdirectories and files.
 *
 * When copying a directory to another directory, globs are not supported and
 * behavior is similar to `cp dir1/ dir2/`.
 * @since v16.7.0
 * @experimental
 * @param src source path to copy.
 * @param dest destination path to copy to.
 * @return Fulfills with `undefined` upon success.
 */
export async function cp(
  source: string | URL,
  destination: string | URL,
  opts?: CopyOptions
): Promise<void> {
  return await sendMethod("cp", source, destination, opts);
}
