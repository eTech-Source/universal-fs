export interface MkdirParams {
    path: PathLike;
    options: MakeDirectoryOptions & {
        recursive: true;
    } & Abortable;
}
export type MkdirReturn = Promise<string | void>;
