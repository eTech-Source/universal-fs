// @ts-nocheck

interface Options extends ObjectEncodingOptions, Abortable {
  withFileTypes?: false | undefined;
  recursive?: boolean | undefined;
}

export interface ReaddirParams {
  path: PathLike;
  options?: Options | null;
}

export type ReaddirReturn = Promise<string[]>;
