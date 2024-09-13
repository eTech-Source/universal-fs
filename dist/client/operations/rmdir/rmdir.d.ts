import { RmdirParams, RmdirReturn } from "./types/rmdir";
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
declare const rmdir: (path: RmdirParams["path"], options?: RmdirParams["options"]) => RmdirReturn;
export default rmdir;
