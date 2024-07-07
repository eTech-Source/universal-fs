import auth from "./client/auth";
import Server from "./server/server";
import readFile from "./client/operations/readFile/readFile";
import readdir from "./client/operations/readdir/readdir";
import writeFile from "./client/operations/writeFile/writeFile";
import mkdir from "./client/operations/mkdir/mkdir";
import unlink from "./client/operations/unlink/unlink";
import rmdir from "./client/operations/rmdir/rmdir";
/**
 * Initialize the connection to the relay server. Avabile in most JS environments
 * @param url - The url of the relay server
 * @param password - The password to protect the files
 * @async
 */
declare const init: (url: string, password?: string) => Promise<void>;
export { init, Server, auth, readFile, readdir, writeFile, mkdir, unlink, rmdir };
