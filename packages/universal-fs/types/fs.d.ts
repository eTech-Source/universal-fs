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
  export type TimeLike = string | number | Date;

  /**
   * The encoding used in a Buffer
   * @see {@link Buffer}
   * @see {@link https://github.com/nodejs/node/blob/main/doc/api/buffer.md}
   */

  interface FileHandle {
    /**
     * The numeric file descriptor managed by the {FileHandle} object.
     * @since v10.0.0
     */
    readonly fd: number;
    /**
     * Alias of `filehandle.writeFile()`.
     *
     * When operating on file handles, the mode cannot be changed from what it was set
     * to with `fsPromises.open()`. Therefore, this is equivalent to `filehandle.writeFile()`.
     * @since v10.0.0
     * @return Fulfills with `undefined` upon success.
     */
    appendFile(
      data: string | Uint8Array,
      options?:
        | (ObjectEncodingOptions &
            FlagAndOpenMode & {flush?: boolean | undefined})
        | BufferEncoding
        | null
    ): Promise<void>;
    /**
     * Changes the ownership of the file. A wrapper for [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2.html).
     * @since v10.0.0
     * @param uid The file's new owner's user id.
     * @param gid The file's new group's group id.
     * @return Fulfills with `undefined` upon success.
     */
    chown(uid: number, gid: number): Promise<void>;
    /**
     * Modifies the permissions on the file. See [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2.html).
     * @since v10.0.0
     * @param mode the file mode bit mask.
     * @return Fulfills with `undefined` upon success.
     */
    chmod(mode: Mode): Promise<void>;
    /**
     * Unlike the 16 KiB default `highWaterMark` for a `stream.Readable`, the stream
     * returned by this method has a default `highWaterMark` of 64 KiB.
     *
     * `options` can include `start` and `end` values to read a range of bytes from
     * the file instead of the entire file. Both `start` and `end` are inclusive and
     * start counting at 0, allowed values are in the
     * \[0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)\] range. If `start` is
     * omitted or `undefined`, `filehandle.createReadStream()` reads sequentially from
     * the current file position. The `encoding` can be any one of those accepted by `Buffer`.
     *
     * If the `FileHandle` points to a character device that only supports blocking
     * reads (such as keyboard or sound card), read operations do not finish until data
     * is available. This can prevent the process from exiting and the stream from
     * closing naturally.
     *
     * By default, the stream will emit a `'close'` event after it has been
     * destroyed.  Set the `emitClose` option to `false` to change this behavior.
     *
     * ```js
     * import { open } from 'node:fs/promises';
     *
     * const fd = await open('/dev/input/event0');
     * // Create a stream from some character device.
     * const stream = fd.createReadStream();
     * setTimeout(() => {
     *   stream.close(); // This may not close the stream.
     *   // Artificially marking end-of-stream, as if the underlying resource had
     *   // indicated end-of-file by itself, allows the stream to close.
     *   // This does not cancel pending read operations, and if there is such an
     *   // operation, the process may still not be able to exit successfully
     *   // until it finishes.
     *   stream.push(null);
     *   stream.read(0);
     * }, 100);
     * ```
     *
     * If `autoClose` is false, then the file descriptor won't be closed, even if
     * there's an error. It is the application's responsibility to close it and make
     * sure there's no file descriptor leak. If `autoClose` is set to true (default
     * behavior), on `'error'` or `'end'` the file descriptor will be closed
     * automatically.
     *
     * An example to read the last 10 bytes of a file which is 100 bytes long:
     *
     * ```js
     * import { open } from 'node:fs/promises';
     *
     * const fd = await open('sample.txt');
     * fd.createReadStream({ start: 90, end: 99 });
     * ```
     * @since v16.11.0
     */
    createReadStream(options?: CreateReadStreamOptions): ReadStream;
    /**
     * `options` may also include a `start` option to allow writing data at some
     * position past the beginning of the file, allowed values are in the
     * \[0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)\] range. Modifying a file rather than
     * replacing it may require the `flags` `open` option to be set to `r+` rather than
     * the default `r`. The `encoding` can be any one of those accepted by `Buffer`.
     *
     * If `autoClose` is set to true (default behavior) on `'error'` or `'finish'` the file descriptor will be closed automatically. If `autoClose` is false,
     * then the file descriptor won't be closed, even if there's an error.
     * It is the application's responsibility to close it and make sure there's no
     * file descriptor leak.
     *
     * By default, the stream will emit a `'close'` event after it has been
     * destroyed.  Set the `emitClose` option to `false` to change this behavior.
     * @since v16.11.0
     */
    createWriteStream(options?: CreateWriteStreamOptions): WriteStream;
    /**
     * Forces all currently queued I/O operations associated with the file to the
     * operating system's synchronized I/O completion state. Refer to the POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2.html) documentation for details.
     *
     * Unlike `filehandle.sync` this method does not flush modified metadata.
     * @since v10.0.0
     * @return Fulfills with `undefined` upon success.
     */
    datasync(): Promise<void>;
    /**
     * Request that all data for the open file descriptor is flushed to the storage
     * device. The specific implementation is operating system and device specific.
     * Refer to the POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2.html) documentation for more detail.
     * @since v10.0.0
     * @return Fulfills with `undefined` upon success.
     */
    sync(): Promise<void>;
    /**
     * Reads data from the file and stores that in the given buffer.
     *
     * If the file is not modified concurrently, the end-of-file is reached when the
     * number of bytes read is zero.
     * @since v10.0.0
     * @param buffer A buffer that will be filled with the file data read.
     * @param offset The location in the buffer at which to start filling.
     * @param length The number of bytes to read.
     * @param position The location where to begin reading data from the file. If `null`, data will be read from the current file position, and the position will be updated. If `position` is an
     * integer, the current file position will remain unchanged.
     * @return Fulfills upon success with an object with two properties:
     */
    read<T extends NodeJS.ArrayBufferView>(
      buffer: T,
      offset?: number | null,
      length?: number | null,
      position?: number | null
    ): Promise<FileReadResult<T>>;
    read<T extends NodeJS.ArrayBufferView = Buffer>(
      options?: FileReadOptions<T>
    ): Promise<FileReadResult<T>>;
    /**
     * Returns a `ReadableStream` that may be used to read the files data.
     *
     * An error will be thrown if this method is called more than once or is called
     * after the `FileHandle` is closed or closing.
     *
     * ```js
     * import {
     *   open,
     * } from 'node:fs/promises';
     *
     * const file = await open('./some/file/to/read');
     *
     * for await (const chunk of file.readableWebStream())
     *   console.log(chunk);
     *
     * await file.close();
     * ```
     *
     * While the `ReadableStream` will read the file to completion, it will not
     * close the `FileHandle` automatically. User code must still call the`fileHandle.close()` method.
     * @since v17.0.0
     * @experimental
     */
    readableWebStream(options?: ReadableWebStreamOptions): ReadableStream;
    /**
     * Asynchronously reads the entire contents of a file.
     *
     * If `options` is a string, then it specifies the `encoding`.
     *
     * The `FileHandle` has to support reading.
     *
     * If one or more `filehandle.read()` calls are made on a file handle and then a `filehandle.readFile()` call is made, the data will be read from the current
     * position till the end of the file. It doesn't always read from the beginning
     * of the file.
     * @since v10.0.0
     * @return Fulfills upon a successful read with the contents of the file. If no encoding is specified (using `options.encoding`), the data is returned as a {Buffer} object. Otherwise, the
     * data will be a string.
     */
    readFile(
      options?: {
        encoding?: null | undefined;
        flag?: OpenMode | undefined;
      } | null
    ): Promise<Buffer>;
    /**
     * Asynchronously reads the entire contents of a file. The underlying file will _not_ be closed automatically.
     * The `FileHandle` must have been opened for reading.
     * @param options An object that may contain an optional flag.
     * If a flag is not provided, it defaults to `'r'`.
     */
    readFile(
      options:
        | {
            encoding: BufferEncoding;
            flag?: OpenMode | undefined;
          }
        | BufferEncoding
    ): Promise<string>;
    /**
     * Asynchronously reads the entire contents of a file. The underlying file will _not_ be closed automatically.
     * The `FileHandle` must have been opened for reading.
     * @param options An object that may contain an optional flag.
     * If a flag is not provided, it defaults to `'r'`.
     */
    readFile(
      options?:
        | (ObjectEncodingOptions & {
            flag?: OpenMode | undefined;
          })
        | BufferEncoding
        | null
    ): Promise<string | Buffer>;
    /**
     * Convenience method to create a `readline` interface and stream over the file.
     * See `filehandle.createReadStream()` for the options.
     *
     * ```js
     * import { open } from 'node:fs/promises';
     *
     * const file = await open('./some/file/to/read');
     *
     * for await (const line of file.readLines()) {
     *   console.log(line);
     * }
     * ```
     * @since v18.11.0
     */
    readLines(options?: CreateReadStreamOptions): ReadlineInterface;
    /**
     * @since v10.0.0
     * @return Fulfills with an {fs.Stats} for the file.
     */
    stat(
      opts?: StatOptions & {
        bigint?: false | undefined;
      }
    ): Promise<Stats>;
    stat(
      opts: StatOptions & {
        bigint: true;
      }
    ): Promise<BigIntStats>;
    stat(opts?: StatOptions): Promise<Stats | BigIntStats>;
    /**
     * Truncates the file.
     *
     * If the file was larger than `len` bytes, only the first `len` bytes will be
     * retained in the file.
     *
     * The following example retains only the first four bytes of the file:
     *
     * ```js
     * import { open } from 'node:fs/promises';
     *
     * let filehandle = null;
     * try {
     *   filehandle = await open('temp.txt', 'r+');
     *   await filehandle.truncate(4);
     * } finally {
     *   await filehandle?.close();
     * }
     * ```
     *
     * If the file previously was shorter than `len` bytes, it is extended, and the
     * extended part is filled with null bytes (`'\0'`):
     *
     * If `len` is negative then `0` will be used.
     * @since v10.0.0
     * @param [len=0]
     * @return Fulfills with `undefined` upon success.
     */
    truncate(len?: number): Promise<void>;
    /**
     * Change the file system timestamps of the object referenced by the `FileHandle` then fulfills the promise with no arguments upon success.
     * @since v10.0.0
     */
    utimes(atime: TimeLike, mtime: TimeLike): Promise<void>;
    /**
     * Asynchronously writes data to a file, replacing the file if it already exists. `data` can be a string, a buffer, an
     * [AsyncIterable](https://tc39.github.io/ecma262/#sec-asynciterable-interface), or an
     * [Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) object.
     * The promise is fulfilled with no arguments upon success.
     *
     * If `options` is a string, then it specifies the `encoding`.
     *
     * The `FileHandle` has to support writing.
     *
     * It is unsafe to use `filehandle.writeFile()` multiple times on the same file
     * without waiting for the promise to be fulfilled (or rejected).
     *
     * If one or more `filehandle.write()` calls are made on a file handle and then a`filehandle.writeFile()` call is made, the data will be written from the
     * current position till the end of the file. It doesn't always write from the
     * beginning of the file.
     * @since v10.0.0
     */
    writeFile(
      data: string | Uint8Array,
      options?:
        | (ObjectEncodingOptions &
            FlagAndOpenMode &
            Abortable & {flush?: boolean | undefined})
        | BufferEncoding
        | null
    ): Promise<void>;
    /**
     * Write `buffer` to the file.
     *
     * The promise is fulfilled with an object containing two properties:
     *
     * It is unsafe to use `filehandle.write()` multiple times on the same file
     * without waiting for the promise to be fulfilled (or rejected). For this
     * scenario, use `filehandle.createWriteStream()`.
     *
     * On Linux, positional writes do not work when the file is opened in append mode.
     * The kernel ignores the position argument and always appends the data to
     * the end of the file.
     * @since v10.0.0
     * @param offset The start position from within `buffer` where the data to write begins.
     * @param [length=buffer.byteLength - offset] The number of bytes from `buffer` to write.
     * @param [position='null'] The offset from the beginning of the file where the data from `buffer` should be written. If `position` is not a `number`, the data will be written at the current
     * position. See the POSIX pwrite(2) documentation for more detail.
     */
    write<TBuffer extends Uint8Array>(
      buffer: TBuffer,
      offset?: number | null,
      length?: number | null,
      position?: number | null
    ): Promise<{
      bytesWritten: number;
      buffer: TBuffer;
    }>;
    write(
      data: string,
      position?: number | null,
      encoding?: BufferEncoding | null
    ): Promise<{
      bytesWritten: number;
      buffer: string;
    }>;
    /**
     * Write an array of [ArrayBufferView](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) s to the file.
     *
     * The promise is fulfilled with an object containing a two properties:
     *
     * It is unsafe to call `writev()` multiple times on the same file without waiting
     * for the promise to be fulfilled (or rejected).
     *
     * On Linux, positional writes don't work when the file is opened in append mode.
     * The kernel ignores the position argument and always appends the data to
     * the end of the file.
     * @since v12.9.0
     * @param [position='null'] The offset from the beginning of the file where the data from `buffers` should be written. If `position` is not a `number`, the data will be written at the current
     * position.
     */
    writev(
      buffers: readonly NodeJS.ArrayBufferView[],
      position?: number
    ): Promise<WriteVResult>;
    /**
     * Read from a file and write to an array of [ArrayBufferView](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) s
     * @since v13.13.0, v12.17.0
     * @param [position='null'] The offset from the beginning of the file where the data should be read from. If `position` is not a `number`, the data will be read from the current position.
     * @return Fulfills upon success an object containing two properties:
     */
    readv(
      buffers: readonly NodeJS.ArrayBufferView[],
      position?: number
    ): Promise<ReadVResult>;
    /**
     * Closes the file handle after waiting for any pending operation on the handle to
     * complete.
     *
     * ```js
     * import { open } from 'node:fs/promises';
     *
     * let filehandle;
     * try {
     *   filehandle = await open('thefile.txt', 'r');
     * } finally {
     *   await filehandle?.close();
     * }
     * ```
     * @since v10.0.0
     * @return Fulfills with `undefined` upon success.
     */
    close(): Promise<void>;
    /**
     * An alias for {@link FileHandle.close()}.
     * @since v20.4.0
     */
    [Symbol.asyncDispose](): Promise<void>;
  }

  /**
   * Defines an object with an option param for open()
   */
  interface FlagAndOpenMode {
    mode?: Mode | undefined;
    flag?: OpenMode | undefined;
  }

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

  /**
   * Options for `fs.stat` and `lstat`
   * @see stat
   * @see lstat
   */
  export interface StatOptions {
    bigint?: boolean | undefined;
  }

  /**
   * Unresolved
   */
  export type Stat = unknown;

  export interface WatchOptions extends Abortable {
    /**
     * Specifies the character encoding to use when watching files.
     * @default 'utf8'
     */
    encoding?: BufferEncoding | "buffer" | undefined;
    /**
     * Indicates whether the process should continue to run as long as files are
     * being watched.  Set to `false` to stop watching when all files are closed.
     * @default true
     */
    persistent?: boolean | undefined;
    /**
     * Indicates whether all subdirectories should be watched, or only the current
     * directory.
     * @default false
     */
    recursive?: boolean | undefined;
  }

  /**
   * Holds information about a watched file or directory
   */
  interface FileChangeInfo<T extends string | Buffer> {
    eventType: WatchEventType;
    filename: T | null;
  }

  /**
   * Options for `fs.opendir`
   * @see opendir
   */
  export interface OpenDirOptions {
    /**
     * @default 'utf8'
     */
    encoding?: BufferEncoding | undefined;
    /**
     * Number of directory entries that are buffered
     * internally when reading from the directory. Higher values lead to better
     * performance but higher memory usage.
     * @default 32
     */
    bufferSize?: number | undefined;
    /**
     * @default false
     */
    recursive?: boolean;
  }

  export interface CopyOptions extends CopyOptionsBase {
    /**
     * Function to filter copied files/directories. Return
     * `true` to copy the item, `false` to ignore it.
     */
    filter?(source: string, destination: string): boolean | Promise<boolean>;
  }

  /**
   * A class for handling directory stream
   */
  export class Dir implements AsyncIterable<Dirent> {
    /**
     * The read-only path of this directory as was provided to {@link opendir},{@link opendirSync}, or `fsPromises.opendir()`.
     * @since v12.12.0
     */
    readonly path: string;
    /**
     * Asynchronously iterates over the directory via `readdir(3)` until all entries have been read.
     */
    [Symbol.asyncIterator](): AsyncIterableIterator<Dirent>;
    /**
     * Asynchronously close the directory's underlying resource handle.
     * Subsequent reads will result in errors.
     *
     * A promise is returned that will be fulfilled after the resource has been
     * closed.
     * @since v12.12.0
     */
    close(): Promise<void>;
    close(cb: NoParamCallback): void;
    /**
     * Synchronously close the directory's underlying resource handle.
     * Subsequent reads will result in errors.
     * @since v12.12.0
     */
    closeSync(): void;
    /**
     * Asynchronously read the next directory entry via [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3.html) as an `fs.Dirent`.
     *
     * A promise is returned that will be fulfilled with an `fs.Dirent`, or `null` if there are no more directory entries to read.
     *
     * Directory entries returned by this function are in no particular order as
     * provided by the operating system's underlying directory mechanisms.
     * Entries added or removed while iterating over the directory might not be
     * included in the iteration results.
     * @since v12.12.0
     * @return containing {fs.Dirent|null}
     */
    read(): Promise<Dirent | null>;
    read(
      cb: (err: NodeJS.ErrnoException | null, dirEnt: Dirent | null) => void
    ): void;
    /**
     * Synchronously read the next directory entry as an `fs.Dirent`. See the
     * POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3.html) documentation for more detail.
     *
     * If there are no more directory entries to read, `null` will be returned.
     *
     * Directory entries returned by this function are in no particular order as
     * provided by the operating system's underlying directory mechanisms.
     * Entries added or removed while iterating over the directory might not be
     * included in the iteration results.
     * @since v12.12.0
     */
    readSync(): Dirent | null;
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
