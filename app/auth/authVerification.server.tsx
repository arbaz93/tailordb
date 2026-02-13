/**
 * Server-side authentication helper
 * Checks if a request has a valid auth cookie
 */

import { parse } from "cookie";
import { base64Decode } from "~/utils/scripting";
import { AUTH_COOKIE } from "~/utils/constants";

/**
 * Checks the authentication status from the request cookies
 * @param request - Incoming Request object
 * @returns status code (e.g., 200) if authenticated, or false if not
 */
export function checkAuth(request: Request): number | false {
  // Get the cookie header from the request
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;

  // Parse cookies into an object
  const cookies = parse(cookieHeader);

  // Get the auth cookie value
  const token = cookies[AUTH_COOKIE];
  if (!token) return false;

  // Try decoding and parsing the cookie
  try {
    const parsed = JSON.parse(base64Decode(token));
    return parsed?.status ?? false;
  } catch (err) {
    // Invalid or corrupted cookie
    return false;
  }
}
