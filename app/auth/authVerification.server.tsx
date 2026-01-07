// auth.server.ts (new file)
import { parse } from "cookie";
import { base64Decode } from "~/utils/scripting";
export function checkAuth(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;

  const cookies = parse(cookieHeader);
  const token = cookies.t000;

  if (!token) return false;

  try {
    return JSON.parse(base64Decode(token)).status;
  } catch {
    return false;
  }
}
