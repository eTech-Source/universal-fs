export interface ReadFileParams {
    path: PathLike;
    options?: ({
        encoding?: null | undefined | BufferEncoding;
        flag?: OpenMode | undefined;
    } & Abortable) | null;
}
export type ReadFileReturn = Promise<string | Buffer>;
