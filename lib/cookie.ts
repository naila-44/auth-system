
export function getTokenFromRequest(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const tokenPair = cookie.split(";").map(s => s.trim()).find(s => s.startsWith("token="));
  if (!tokenPair) return null;
  return tokenPair.split("=")[1];
}
