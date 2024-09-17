import {isBrowser, isNode} from "browser-or-node";

const pollyfillBuffer = async () => {
  let BufferPolyfill;

  if (isBrowser) {
    BufferPolyfill = (await import("buffer/")).Buffer;
  } else if (isNode) {
    BufferPolyfill = Buffer;
  } else {
    throw new Error("Failed to pollyfill Buffer. Unsupported environment");
  }

  return BufferPolyfill;
};

export default pollyfillBuffer;
