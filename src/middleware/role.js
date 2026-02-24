import { forbiddenResponse } from "../utils/apiResponse.js";

export const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) return forbiddenResponse(res, "Not authenticated");
    if (!roles.includes(req.user.role))
        return forbiddenResponse(res, `Access denied. Required role: ${roles.join(" or ")}`);
    next();
};

export const requireAdmin = requireRole("admin");