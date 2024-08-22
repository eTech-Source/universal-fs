declare const pollyfillBuffer: () => Promise<typeof import("buffer").Buffer | BufferConstructor>;
export default pollyfillBuffer;
