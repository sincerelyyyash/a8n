import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET ?? "secret_token"

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const userId = (decoded as JwtPayload)?.userId ?? (decoded as any)?.id;
    if (!userId) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    (req as any).user = { id: userId };

    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

