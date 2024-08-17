import getUrl from "../../../helpers/getUrl";
import getToken from "../../../helpers/getToken";
import {ExistsParams, ExistsReturn} from "./types/exists";

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
const exists = async (
  path: ExistsParams["path"],
  options?: ExistsParams["options"]
): ExistsReturn => {
  const url = await getUrl();

  try {
    const response = await fetch(
      `${url}/${encodeURIComponent(path as string)}?method=exists`,
      {
        signal: options?.signal,
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      }
    );

    const {exists} = await response.json();
    return exists;
  } catch (err: any) {
    throw err;
  }
};

export default exists;
