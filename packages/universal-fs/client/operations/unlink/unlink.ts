import {UnlinkParams, UnlinkReturn} from "./types/unlink";
import getUrl from "../../../helpers/getUrl";

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
const unlink = async (
  path: UnlinkParams["path"],
  options?: UnlinkParams["options"]
): UnlinkReturn => {
  const url = await getUrl();

  try {
    await fetch(`${url}/${encodeURIComponent(path as string)}?method=unlink`, {
      signal: options?.signal,
      method: "DELETE"
    });
  } catch (err) {
    throw err;
  }
};

export default unlink;
