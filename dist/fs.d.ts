export {};

declare global {
  // Types for paths
  /**
   * A string, Buffer, or URL that point to a path
   * @see {@link Buffer}
   */
  type PathLike = string | Buffer | URL;

  /**
   * The mode that shows the state of the file. As a string it can be one of the following value:
   * - `r`: Open file for reading. An exception occurs if the file does not exist.
   *
   * - `r+`: Open file for reading and writing. An exception occurs if the file does not exist.
   *
   * - `rs+`: Open file for reading and writing in synchronous mode. An exception occurs if the file does not exist.
   *
   * - `w`: Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
   *
   * - `wx`: Like `w` but fails if the path exists.
   *
   * - `w+`: Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
   *
   * - `wx+`: Like `w+` but fails if the path exists.
   *
   * - `a`: Open file for appending. The file is created if it does not exist.
   *
   * - `ax`: Like `a` but fails if the path exists.
   *
   * - `a+`: Open file for reading and appending. The file is created if it does not exist.
   *
   * - `ax+`: Like `a+` but fails if the path exists.
   *
   * It can also be a number
   */
  type OpenMode = number | string;
  type Mode = number | string;

  /**
   * The encoding used in a Buffer
   * @see {@link Buffer}
   * @see {@link https://github.com/nodejs/node/blob/main/doc/api/buffer.md}
   */

  //@ts-expect-error
  // This is an overide in Node.js runtimes
  type BufferEncoding =
    | "ascii"
    | "utf8"
    | "utf-8"
    | "utf16le"
    | "utf-16le"
    | "ucs2"
    | "ucs-2"
    | "base64"
    | "base64url"
    | "latin1"
    | "binary"
    | "hex";

  /**
   * Defines an object with an option param for encoding
   * @see {@link BufferEncoding}
   */
  interface ObjectEncodingOptions {
    encoding?: BufferEncoding | null | undefined;
  }

  export interface MakeDirectoryOptions {
    /**
     * Indicates whether parent folders should be created.
     * If a folder was created, the path to the first created folder will be returned.
     * @default false
     */
    recursive?: boolean | undefined;
    /**
     * A file mode. If a string is passed, it is parsed as an octal integer. If not specified
     * @default 0o777
     */
    mode?: Mode | undefined;
  }

  // Node.js types required

  /**
   * When provided the corresponding `AbortController` can be used to cancel an asynchronous action.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal}
   * @see {@link AbortSignal}
   */
  interface Abortable {
    signal?: AbortSignal | undefined;
  }

  /**
   * Options for `fs.rmdir`
   * @see {@link rmdir}
   */
  export interface RmDirOptions {
    /**
     * If an `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY`, or
     * `EPERM` error is encountered, Node.js will retry the operation with a linear
     * backoff wait of `retryDelay` ms longer on each try. This option represents the
     * number of retries. This option is ignored if the `recursive` option is not
     * `true`.
     * @default 0
     */
    maxRetries?: number | undefined;
    /**
     * @deprecated since v14.14.0 In future versions of Node.js and will trigger a warning
     * `fs.rmdir(path, { recursive: true })` will throw if `path` does not exist or is a file.
     * Use `fs.rm(path, { recursive: true, force: true })` instead.
     *
     * If `true`, perform a recursive directory removal. In
     * recursive mode, operations are retried on failure.
     * @default false
     */
    recursive?: boolean | undefined;
    /**
     * The amount of time in milliseconds to wait between retries.
     * This option is ignored if the `recursive` option is not `true`.
     * @default 100
     */
    retryDelay?: number | undefined;
  }

  // Node Namespaces
  namespace NodeJS {
    // compatibility with older typings
    interface Timer extends RefCounted {
      hasRef(): boolean;
      refresh(): this;
      [Symbol.toPrimitive](): number;
    }
    /**
     * This object is created internally and is returned from `setImmediate()`. It
     * can be passed to `clearImmediate()` in order to cancel the scheduled
     * actions.
     *
     * By default, when an immediate is scheduled, the Node.js event loop will continue
     * running as long as the immediate is active. The `Immediate` object returned by `setImmediate()` exports both `immediate.ref()` and `immediate.unref()` functions that can be used to
     * control this default behavior.
     */
    //@ts-expect-error
    // This is an overide in Node.js runtimes
    class Immediate implements RefCounted {
      /**
       * When called, requests that the Node.js event loop _not_ exit so long as the `Immediate` is active. Calling `immediate.ref()` multiple times will have no
       * effect.
       *
       * By default, all `Immediate` objects are "ref'ed", making it normally unnecessary
       * to call `immediate.ref()` unless `immediate.unref()` had been called previously.
       * @since v9.7.0
       * @return a reference to `immediate`
       */
      ref(): this;
      /**
       * When called, the active `Immediate` object will not require the Node.js event
       * loop to remain active. If there is no other activity keeping the event loop
       * running, the process may exit before the `Immediate` object's callback is
       * invoked. Calling `immediate.unref()` multiple times will have no effect.
       * @since v9.7.0
       * @return a reference to `immediate`
       */
      unref(): this;
      /**
       * If true, the `Immediate` object will keep the Node.js event loop active.
       * @since v11.0.0
       */
      hasRef(): boolean;
      _onImmediate: Function; // to distinguish it from the Timeout class
      /**
       * Cancels the immediate. This is similar to calling `clearImmediate()`.
       * @since v20.5.0
       */
      [Symbol.dispose](): void;
    }
    /**
     * This object is created internally and is returned from `setTimeout()` and `setInterval()`. It can be passed to either `clearTimeout()` or `clearInterval()` in order to cancel the
     * scheduled actions.
     *
     * By default, when a timer is scheduled using either `setTimeout()` or `setInterval()`, the Node.js event loop will continue running as long as the
     * timer is active. Each of the `Timeout` objects returned by these functions
     * export both `timeout.ref()` and `timeout.unref()` functions that can be used to
     * control this default behavior.
     */
    //@ts-expect-error
    // This is an overide in Node.js runtimes
    class Timeout implements Timer {
      /**
       * When called, requests that the Node.js event loop _not_ exit so long as the`Timeout` is active. Calling `timeout.ref()` multiple times will have no effect.
       *
       * By default, all `Timeout` objects are "ref'ed", making it normally unnecessary
       * to call `timeout.ref()` unless `timeout.unref()` had been called previously.
       * @since v0.9.1
       * @return a reference to `timeout`
       */
      ref(): this;
      /**
       * When called, the active `Timeout` object will not require the Node.js event loop
       * to remain active. If there is no other activity keeping the event loop running,
       * the process may exit before the `Timeout` object's callback is invoked. Calling `timeout.unref()` multiple times will have no effect.
       * @since v0.9.1
       * @return a reference to `timeout`
       */
      unref(): this;
      /**
       * If true, the `Timeout` object will keep the Node.js event loop active.
       * @since v11.0.0
       */
      hasRef(): boolean;
      /**
       * Sets the timer's start time to the current time, and reschedules the timer to
       * call its callback at the previously specified duration adjusted to the current
       * time. This is useful for refreshing a timer without allocating a new
       * JavaScript object.
       *
       * Using this on a timer that has already called its callback will reactivate the
       * timer.
       * @since v10.2.0
       * @return a reference to `timeout`
       */
      refresh(): this;
      [Symbol.toPrimitive](): number;
      /**
       * Cancels the timeout.
       * @since v20.5.0
       */
      [Symbol.dispose](): void;
    }
  }

  type TypedArray =
    | Uint8Array
    | Uint8ClampedArray
    | Uint16Array
    | Uint32Array
    | Int8Array
    | Int16Array
    | Int32Array
    | BigUint64Array
    | BigInt64Array
    | Float32Array
    | Float64Array;
  //@ts-expect-error
  // This is an overide in Node.js runtimes
  type ArrayBufferView = TypedArray | DataView;

  interface Int8Array {
    readonly [Symbol.toStringTag]: "Int8Array";
  }
}
