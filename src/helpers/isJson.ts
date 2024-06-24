const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (err: any) {
    return false;
  }
};

export default isJson;
