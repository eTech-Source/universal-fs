/**
 * Check if a string is json
 * @param str The string to check
 * @returns A boolean if true the string is valid otherwise false
 */
const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (err: any) {
    return false;
  }
};

export default isJson;
