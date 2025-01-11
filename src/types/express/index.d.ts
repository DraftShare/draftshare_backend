import jwt from "jsonwebtoken";
export {}


declare global {
  namespace Express {
    export interface Request {
      // language?: Language;
      user?: string | jwt.JwtPayload;
    }
  }
}