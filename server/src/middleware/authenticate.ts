import { Request, Response, NextFunction } from "express";
import { auth as oauthAuth } from 'express-oauth2-jwt-bearer';
import jwt from "jsonwebtoken";

const checkOAuth = oauthAuth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export default async function dualAuthenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  // Try OAuth2.0 validation first
  let oauthError: any = null;
  await new Promise(resolve => {
    checkOAuth(req, res, (err) => {
      if (!err) {
        // OAuth2.0 token is valid, req.auth is set
        return resolve(true);
      }
      oauthError = err;
      resolve(false);
    });
  });
  if (req.auth) return next();

  // Try local JWT validation
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    return next();
  } catch (err) {
    // fall through
  }

  // If neither is valid
  return res.status(401).json({ error: "Invalid or expired token" });
} 