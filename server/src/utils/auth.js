import crypto from "crypto";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "club-district-dev-secret";
const jwtExpiry = process.env.JWT_EXPIRES_IN || "7d";

export function signAuthToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiry });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, jwtSecret);
}

export function createResetToken() {
  return crypto.randomBytes(32).toString("hex");
}
