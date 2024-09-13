import {ReaddirParams, ReaddirReturn} from "./types/readdir";
import getUrl from "../../../helpers/getUrl";
import getToken from "../../../helpers/getToken";

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
const readdir = async (
  path: ReaddirParams["path"],
  options?: ReaddirParams["options"]
): ReaddirReturn => {
  const url = await getUrl();

  try {
    const response = await fetch(
      `${url}/${encodeURIComponent(path as string)}?method=readdir`,
      {
        signal: options?.signal,
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          options: JSON.stringify(options)
        }
      }
    );

    const {dirs} = await response.json();
    return dirs;
  } catch (err) {
    throw err;
  }
};

export default readdir;
