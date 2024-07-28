export interface ExistsParams {
    path: PathLike;
    options?: Abortable;
}
export type ExistsReturn = Promise<boolean>;
