// @ts-nocheck

export interface RmdirParams {
  path: PathLike;
  options?: RmDirOptions & Abortable;
}

export type RmdirReturn = Promise<void>;
