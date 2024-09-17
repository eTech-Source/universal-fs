/**
 * Find a cookie by name
 * @param cookieName - The name of the cookie
 * @returns A cookie string or null
 */
const getCookie = (cookieName: string): string | null => {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
};

export default getCookie;
