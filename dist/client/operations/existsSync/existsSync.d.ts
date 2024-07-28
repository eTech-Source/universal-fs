/**
 * Returns `true` if the path exists, `false` otherwise.
 *
 * For detailed information, see the documentation of the asynchronous version of
 * this API: {@link exists}.
 *
 * `fs.exists()` is deprecated, but `fs.existsSync()` is not. The `callback` parameter to `fs.exists()` accepts parameters that are inconsistent with other
 * Node.js callbacks. `fs.existsSync()` does not use a callback.
 *
 * ```js
 * import { existsSync } from 'node:fs';
 *
 * if (existsSync('/etc/passwd'))
 *   console.log('The path exists.');
 * ```
 * @since universal-fs v1.3.0 | Node.js v0.1.21
 */
declare const existsSync: (path: PathLike) => boolean;
export default existsSync;
