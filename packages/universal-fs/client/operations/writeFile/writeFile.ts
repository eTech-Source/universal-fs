import {WriteFileParams} from "./types/writeFile";
import getUrl from "../../../helpers/getUrl";
import getToken from "../../../helpers/getToken";

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
const writeFile = async (
  path: WriteFileParams["file"],
  data: WriteFileParams["data"],
  options?: WriteFileParams["options"]
): Promise<void> => {
  const url = await getUrl();

  try {
    const response = await fetch(
      `${url}/${encodeURIComponent(path as string)}?method=writeFile`,
      {
        signal: options?.signal,
        method: "POST",
        headers: {
          "Authorization": `Bearer ${await getToken()}`,
          "options": JSON.stringify(options),
          "content-type": "application/json"
        },
        body: JSON.stringify({contents: data})
      }
    );
  } catch (err: any) {
    throw err;
  }
};

export default writeFile;
