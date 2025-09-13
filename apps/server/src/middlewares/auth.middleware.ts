import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET ?? "secret_token"

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    (req as any).user = {
      id: decoded.id,
    };

    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

