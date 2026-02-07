// auth.server.ts (new file)
import { parse } from "cookie";
import { base64Decode } from "~/utils/scripting";
import { AUTH_COOKIE } from "~/utils/constants";

export function checkAuth(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const c:string|undefined = AUTH_COOKIE; // === auth_session
  if (!cookieHeader) return false;

  const cookies = parse(cookieHeader);

  // dont work
  const token = cookies[AUTH_COOKIE];

  if (!token) return false;

  try {
    return JSON.parse(base64Decode(token)).status;
  } catch {
    return false;
  }
}
