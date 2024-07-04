import {MkdirParams, MkdirReturn} from "./types/mkdir";
import getUrl from "../../../helpers/getUrl";
import getToken from "../../../helpers/getToken";

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
const mkdir = async (
  path: MkdirParams["path"],
  options?: MkdirParams["options"]
): Promise<MkdirReturn> => {
  const url = await getUrl();

  try {
    await fetch(`${url}/${path}?method=mkdir`, {
      method: "POST",
      signal: options?.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${await getToken()}`,
        "options": JSON.stringify(options)
      }
    });
  } catch (err: any) {
    throw err;
  }
};

export default mkdir;
