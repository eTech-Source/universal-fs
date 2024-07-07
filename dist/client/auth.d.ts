/**
 * The auth function called in init
 * @param password - The password to protect the files
 * @see {@link init}
 * @internal
 * @async
 */
declare const auth: (password?: string) => Promise<void>;
export default auth;
