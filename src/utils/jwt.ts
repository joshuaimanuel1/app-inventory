import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
}

const accessTokenOptions: SignOptions = {
  expiresIn: "10m",
  issuer: "inventory-app",
  audience: "inventory-users",
};

const refreshTokenOptions: SignOptions = {
  expiresIn: "3d",
  issuer: "inventory-app",
  audience: "inventory-users",
};

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, accessTokenOptions);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, refreshTokenOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET, {
      issuer: "inventory-app",
      audience: "inventory-users",
    });

    return decoded as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET, {
      issuer: "inventory-app",
      audience: "inventory-users",
    });

    return decoded as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
