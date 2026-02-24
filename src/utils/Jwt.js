import jwt from "jsonwebtoken";

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET  || "access_secret_dev";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret_dev";
const ACCESS_EXPIRES  = process.env.JWT_ACCESS_EXPIRES  || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

export const generateAccessToken  = (payload) => jwt.sign(payload, ACCESS_SECRET,  { expiresIn: ACCESS_EXPIRES });
export const generateRefreshToken = (payload) => jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
export const verifyAccessToken    = (token)   => jwt.verify(token, ACCESS_SECRET);
export const verifyRefreshToken   = (token)   => jwt.verify(token, REFRESH_SECRET);

export const generateTokenPair = (payload) => ({
    accessToken:  generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
});