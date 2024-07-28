import { ExistsParams, ExistsReturn } from "./types/exists";
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
declare const exists: (path: ExistsParams["path"], options?: ExistsParams["options"]) => ExistsReturn;
export default exists;
