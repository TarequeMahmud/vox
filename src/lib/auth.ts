import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const data = cookieStore.get("token");
  if (!data) {
    return null;
  }
  return data?.value ?? null;
}

export async function verifyToken(): Promise<JwtPayload | null> {
  const token = await getToken();
  if (!token) {
    return null;
  }
  const decoded = jwt.decode(token) as JwtPayload | null;
  if (!decoded) {
    return null;
  }
  const currentTime = Math.floor(Date.now() / 1000);

  if (decoded.exp && decoded.exp < currentTime) {
    return null;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return verified as JwtPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
