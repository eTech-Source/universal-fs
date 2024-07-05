export interface UnlinkParams {
  path: PathLike;
  options?: Abortable;
}

export type UnlinkReturn = Promise<void>;
