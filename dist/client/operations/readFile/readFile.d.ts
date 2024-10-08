import { ReadFileParams, ReadFileReturn } from "./types/readFile";
/**
 * Asynchronously reads the entire contents of a file.

If no encoding is specified (using options.encoding), the data is returned as a Buffer object. Otherwise, the data will be a string.

If options is a string, then it specifies the encoding.

When the path is a directory, the behavior of fsPromises.readFile() is platform-specific. On macOS, Linux, and Windows, the promise will be rejected with an error. On FreeBSD, a representation of the directory's contents will be returned.

An example of reading a package.json file located in the same directory of the running code:

```js
import { readFile } from 'universal-fs';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

It is possible to abort an ongoing readFile using an AbortSignal. If a request is aborted the promise returned is rejected with an AbortError:

```js
import { readFile } from 'universal-fs';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```

Aborting an ongoing request does not abort individual operating system requests but rather the internal buffering fs.readFile performs.

Any specified FileHandle has to support reading.

@since universal-fs V1.0.0 | Node.js v10.0.0
@param path filename or FileHandle
@param options Read options
@return Fulfills with the contents of the file.
@async
 */
declare const readFile: (path: ReadFileParams["path"], options?: ReadFileParams["options"]) => ReadFileReturn;
export default readFile;
