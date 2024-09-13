import {RmdirParams, RmdirReturn} from "./types/rmdir";
import getUrl from "../../../helpers/getUrl";
import getToken from "../../../helpers/getToken";

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
const rmdir = async (
  path: RmdirParams["path"],
  options?: RmdirParams["options"]
): RmdirReturn => {
  const url = await getUrl();

  try {
    await fetch(`${url}/${encodeURIComponent(path as string)}`, {
      signal: options?.signal,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        options: JSON.stringify(options)
      }
    });
  } catch (err: any) {
    throw err;
  }
};

export default rmdir;
