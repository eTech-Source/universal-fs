// @ts-nocheck

export type WriteFileParams = {
  file: PathLike;
  data:
    | string
    | ArrayBufferView
    | Iterable<string | ArrayBufferView>
    | AsyncIterable<string | ArrayBufferView>;
  options?:
    | (ObjectEncodingOptions & {
        mode?: Mode | undefined;
        flag?: OpenMode | undefined;
        /**
         * If all data is successfully written to the file, and `flush`
         * is `true`, `filehandle.sync()` is used to flush the data.
         * @default false
         */
        flush?: boolean | undefined;
      } & Abortable)
    | null;
};
