import { verifyAccessToken } from "../utils/Jwt.js";
import { unauthorizedResponse } from "../utils/apiResponse.js";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) return unauthorizedResponse(res, "No token provided");

        const token = authHeader.split(" ")[1];
        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.id);

        if (!user)          return unauthorizedResponse(res, "User no longer exists");
        if (!user.isActive) return unauthorizedResponse(res, "Account has been deactivated");

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") return unauthorizedResponse(res, "Token expired");
        if (error.name === "JsonWebTokenError") return unauthorizedResponse(res, "Invalid token");
        return unauthorizedResponse(res, "Authentication failed");
    }
};

export const optionalAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) return next();
        const token = authHeader.split(" ")[1];
        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.id);
        if (user?.isActive) req.user = user;
    } catch { /* silently ignore */ }
    next();
};